<template>
    <div v-if="!loading" class="offer-container">
      <div class="offer-card">
        <div class="card-header">
          <h1>Offer & Product Details</h1>
        </div>
        <div class="card-content">
          <div class="offer-info">
            <h2>Offer Details</h2>
            <ul>
              <li><strong>Buyer Username:</strong> {{ offer.buyerUsername }}</li>
              <li><strong>Offer Price:</strong> {{ offer.offerPrice }}</li>
              <li><strong>Seller Username:</strong> {{ offer.sellerUsername }}</li>
              <li><strong>Buyer Approved:</strong><span v-if="offer.buyerResolved">🟢</span><span v-else>🔴</span></li>
              <li><strong>Seller Approved:</strong><span v-if="offer.sellerResolved">🟢</span><span v-else>🔴</span></li>
              <li><strong>Paid:</strong><span v-if="finalResolve">🟢</span><span v-else>🔴</span></li>
            </ul>
            <div v-if="myTurn && !paymentStep && !finalResolve" class="action-buttons">
                <button
                    class="action-btn"
                    :class="{ active: selectedAction === 'accept' }"
                    @click="setAction('accept')"
                >
                    Accept
                </button>
                <button
                    class="action-btn"
                    :class="{ active: selectedAction === 'counteroffer' }"
                    @click="setAction('counteroffer')"
                >
                    Counteroffer
                </button>
                <button
                    class="action-btn"
                    :class="{ active: selectedAction === 'reject' }"
                    @click="setAction('reject')"
                >
                    Reject
                </button>
            </div>
            <div v-if="paymentStep">
              <button @click="paymentRedirect()">Pay</button>
            </div>
            <div v-if="!myTurn && !finalResolve"><br><br><strong>Awaiting Response</strong></div>
            <div v-if="selectedAction === 'accept'">
                <!--Are you sure? etc.-->
                <p>This offer is {{ offerInfo() }}</p>
                <p>Do you accept this offer?</p>
                <button @click="acceptOffer()"><div v-if="!buttonLoading">I Accept</div><div v-else><loader/></div></button>
            </div>
            <div v-if="selectedAction === 'counteroffer'">
                <!--trigger counteroffer events etc-->
                <p>This offer is {{ offerInfo() }}</p>
                <p>What amount is your counteroffer?</p>
                <input type="number" v-model.number="newOffer"/>
                <button @click="counterOffer()"><div v-if="!buttonLoading">Send</div><div v-else><loader/></div></button>
            </div>
            <div v-if="selectedAction === 'reject'">
                <!--delete the selected offer from the system and route back to home-->
                <p>This offer is {{ offerInfo() }}</p>
                <p>Are you sure you want to reject this offer?</p>
                <button @click="rejectOffer()"><div v-if="!buttonLoading">Reject Offer</div><div v-else><loader/></div></button>
            </div>
        </div>
          <div v-if="product" class="product-info">
            <h3>{{ product.Title }}</h3>
            <p>{{ product.Description }}</p>
            <p><strong>Original Price:</strong> {{ product.Price }}</p>
            <img :src="product.ProductImages[0]" alt="Product Image" v-if="product.ProductImages && product.ProductImages.length">
          </div>
        </div>
        <div class="card-footer">
          <button @click="goBack()">Back</button>
        </div>
      </div>
    </div>
    <div v-else>
      <loader/>
    </div>
  </template>
    
  <script>
      //imports
      import { getDocs, query, where, collection, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
      import { firebase } from '@/firebase/index.js';
      import loader from "../LoaderIcon.vue"
      //exports
      export default {
          props: ['id'],
          data() {
              return{
                  loading: false,
                  offer: {},
                  oID: "",
                  product: null,
                  selectedAction: '',
                  offerUpDown:'',
                  iAmBuyer: false,
                  iAmSeller: false,
                  myTurn: false,
                  paymentStep: false,
                  newOffer: 0,
                  buttonLoading: false,
                  finalResolve:false
              }
          },
          components:{
            loader
          },
          async mounted() {
              this.oID = this.id
              this.loading = true;
              await this.fetchOffer()
              await this.fetchProduct();
              this.loading = false;
          },
          methods: {
              async acceptOffer(){
                this.buttonLoading = true
                this.product.isAvailable = false
                //make changes and update the offer object
                // if it's the seller approving
                if (this.iAmSeller) {
                  //flip seller approved
                  this.offer.sellerResolved = true;
                  this.offer.sellerTurn = false;
                  await this.firebaseUpdate()
                } 
                //if it's the buyer approving
                else if (this.iAmBuyer) {
                  //flip buyer approved
                  this.offer.buyerResolved = true;
                  //check for seller approval
                  if (this.sellerResolved) {
                    this.paymentStep = true;
                  }
                  await this.firebaseUpdate()
                }
                this.buttonLoading = false
                this.goBack()
              },
              async firebaseUpdate(){
                //send this new offer object back to firebase
                const offerDocRef = doc(firebase, 'offers', this.offer.offerId)
                await updateDoc(offerDocRef, this.offer)
                //update the product too!
                const productRef = doc(firebase,'products',this.product.productID)
                await updateDoc(productRef, this.product)
              },
              async counterOffer(){
                this.buttonLoading = true
                //make changes and update the offer object
                //invert approvals and turn tags
                this.offer.buyerResolved = !this.offer.buyerResolved
                this.offer.sellerResolved = !this.offer.sellerResolved
                this.offer.sellerTurn = !this.offer.sellerTurn
                //update price
                this.offer.offerPrice = this.newOffer
                //Push new offer to firebase
                const offerDocRef = doc(firebase, 'offers', this.offer.offerId)
                await updateDoc(offerDocRef, this.offer)
                this.buttonLoading = false
                //go back to notifications page
                this.goBack()
              },
              async rejectOffer(){
                this.buttonLoading = true
                //delete the offer and go back
                const offersCollection = collection(firebase, 'offers');
                await deleteDoc(doc(offersCollection, this.offer.offerId));
                this.buttonLoading = false
                this.goBack()
              },
              paymentRedirect(){
                //push to the transaction page for this offer
                this.$router.push({name: 'TransactionCredits' ,  params: { offerId: this.offer.offerId }})
              },
                setAction(action) {
                    this.selectedAction = action;
                },
              async fetchOffer() {
                  console.log("Offer Loading...");
                  this.loading = true;
                  const q = query(
                      collection(firebase, 'offers'),
                      where('offerId', '==', this.oID)
                  );
                  const snap = await getDocs(q);
                  if (snap.size > 0) {
                      this.offer = snap.docs.map((doc) => doc.data())[0];
                      console.log("offer Loaded!", this.offer);
                      this.loading = false;
                  } else {
                      console.log("error");
                      this.loading = false
                  }
                  this.newOffer = this.offer.offerPrice 
                  //who am i
                  let currentUserID = this.$store.state.user.uid
                  this.iAmBuyer = (currentUserID == this.offer.buyerId)
                  console.log("Am Buyer",this.iAmBuyer)
                  this.iAmSeller = (currentUserID == this.offer.sellerId)
                  console.log("Am Seller", this.iAmSeller)
                  this.paymentStep = (this.offer.buyerResolved && this.offer.sellerResolved && !this.offer.finalResolve && this.iAmBuyer)
                  this.finalResolve = this.offer.finalResolve
                  if (this.iAmBuyer) {
                    this.myTurn = !this.offer.sellerTurn
                    console.log("I am Buyer")
                  } else if (this.iAmSeller) {
                    this.myTurn = this.offer.sellerTurn
                    console.log("I am seller")
                  }
                  
                },
              async fetchProduct() {
                  this.loading = true;
                  const docRef = doc(firebase, 'products', this.offer.productId);
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                      this.product = docSnap.data();
                  } else {
                      console.log('Product does not exist!');
                  }
                  this.loading = false;
              },
              offerInfo(){
                    let offer = this.offer.offerPrice
                    let prod = this.product.Price
                    let output = ""
                    if(prod == offer){
                    output = "at asking price"
                    } else if (offer < prod){
                    let percDiff = ((prod - offer)/prod)*100
                    output = "%"+percDiff.toFixed(2)+" less than the asking price"
                    } else {
                    let percDiff = ((offer-prod)/prod)*100
                    output = "%"+percDiff.toFixed(2)+" more than the asking price"
                    }
                    return output
                },
              goBack() {
                  this.$router.push({name : 'NotificationsView'})
              },
          }
        }
  </script>
  
  
  <style>
  .offer-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;  /* Light background color to contrast with the card */
  }
  
  .offer-card {
    display: flex;
    flex-direction: column;  /* Ensure it's column to layout header, content, footer */
    max-width: 1200px;
    width: 100%;
    margin: 20px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.15);  /* Enhanced shadow for floating appearance */
    border-radius: 10px;
    background-color: white;
    overflow: hidden;  /* Ensure child elements don't break rounded corners */
  }
  
  .card-header, .card-footer {
    padding: 20px;
    background: #007BFF;
    color: white;
    text-align: center;
  }
  
  .card-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px 0;
  }
  
  .offer-info, .product-info {
    flex: 1;
    padding: 20px;
    border-right: 1px solid #f0f0f0;  /* subtle separator */
  }
  
  .product-info {
    border-right: none;  /* Remove border for product info since it's the last item */
  }
  
  .offer-card h1, .offer-card h2, .product-info h3 {
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .product-info img {
    max-width: 100%;
    border-radius: 10px;
    margin-top: 20px;
  }
  
  .product-info p, .offer-info ul li {
    margin: 10px 0;
  }
  
  button {
    padding: 10px 20px;
    background-color: #c965c9;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 0 auto;  /* center the button */
  }
  
  button:hover {
    background-color: #c965c9;
  }
  
  .action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px; /* space between buttons */
  margin-bottom: 20px; /* space before the back button */
}

.action-btn {
  padding: 10px 20px;
  background-color: #c965c9;
  border: none;
  border-radius: 25px; /* oval shape */
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.action-btn:hover {
  background-color: #c965c9;
  color: white;
}

.action-btn.active {
  background-color: #c965c9;
  color: white;
  position: relative;
}

/* Optional: If you want an explicit oval overlay when selected */
.action-btn.active::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 5px solid #6c6ced;
  border-radius: 25px; /* oval shape */
  box-sizing: border-box;
}
  </style>