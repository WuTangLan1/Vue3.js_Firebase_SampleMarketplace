<template>
    <div class="order-summary" v-if="productData">
        <div class="left-section">
        <h3>Order Summary</h3>
        <div class="product-images" :class="imageContainerClass">
        <img
            v-for="(img, index) in productData.ProductImages"
            :src="img"
            :alt="'Product Image ' + (index + 1)"
            :key="index"
            class="product-image"
        />
        </div>
   
       <div class="product-details">
           <p class="product-title"><strong>Product Title:</strong> {{ productData.Title }}</p>
           <p class="product-description"><strong>Description:</strong> {{ productData.Description }}</p>
           <p class="product-price"><strong>Listed Price:</strong> R{{ productData.Price }}</p>
           <p><strong>Agreed Price:</strong>R{{ offerData.offerPrice }}</p>
           <p class="product-quantity"><strong>Quantity:</strong> {{ productData.AvailableQntty }}</p>
           <p class="product-servicefee"><strong>Service Fee:</strong> R{{ (serviceFee).toFixed(2) }}</p>
           <p class="product-total"><strong>Total Amount:</strong> R{{ (finalTotal).toFixed(2) }}</p>
       </div>
        </div>
        <div class="right-section">
       <h3>Delivery Information</h3>
       <div class="delivery-method">
           <button @click="toggleDeliveryMethod('collect')" :class="{ 'active': deliveryMethod === 'collect' }">Collect</button>
           <button @click="toggleDeliveryMethod('deliver')" :class="{ 'active': deliveryMethod === 'deliver' }">Deliver</button>
           <div v-if="deliveryMethod === 'deliver'" class="delivery-details">
               <input type="text" placeholder="Address" v-model="deliveryAddress" />
               <input type="text" placeholder="Name" v-model="deliveryName" />
               <input type="text" placeholder="Email" v-model="deliveryEmail" />
               <input type="text" placeholder="Cell Number" v-model="deliveryCellNumber" />
           </div>
           <div v-if="deliveryMethod === 'collect'" class="pickup-message">
               Please pick up your order at XYZ location.
           </div>
       </div>
   
       <div class="payment-section" v-if="deliveryMethod">
           <button @click="processOfferPayment()"><div v-if="!loadingButton">Pay</div><div v-else><loader/></div></button>
       </div>
        </div>
   </div>
</template>

<script>
import { getDocs, query, where, collection, doc, setDoc, updateDoc, getDoc} from 'firebase/firestore';
import { firebase } from '@/firebase/index.js'
import {uuid} from 'vue-uuid'
import loader from '../LoaderIcon.vue'

    export default {
        props: ['offerId'],
        components: {
            loader
        },
        data(){
            return {
                productData: null,
                offerData: {},
                loading: false,
                oID: null,
                serviceFee: 0,
                finalTotal: 0,
                deliveryMethod: null,
                deliveryAddress: '',
                deliveryName: '',
                deliveryEmail: '',
                deliveryCellNumber: '',
                loadingButton: false
            }
        },
        computed: {
        imageContainerClass() {
            // Determine the appropriate class based on the number of images
            const numImages = this.productData?.ProductImages?.length || 0;
            if (numImages === 1) {
                return 'single-image';
            } else if (numImages === 2) {
                return 'two-images';
            } else if (numImages === 3) {
                return 'three-images'; // this will apply for 3 or more images, adjust as necessary
            } else {
                return ''; // default class or no class
            }
        },
        },
        async mounted(){
            this.loading = true
            this.oID = this.offerId
            await this.getItems()
            this.calcAmounts()
            this.loading = false
        },
        methods: {
            async getItems() {
                //get offer and load into offerData
                console.log("Offer Loading...");
                  this.loading = true;
                  const q = query(
                      collection(firebase, 'offers'),
                      where('offerId', '==', this.oID)
                  );
                  const snap = await getDocs(q);
                  if (snap.size > 0) {
                      this.offerData = snap.docs.map((doc) => doc.data())[0];
                      console.log("offer Loaded!", this.offerData);
                      this.loading = false;
                  } else {
                      console.log("error");
                      this.loading = false
                  }
                //get product and load into productData
                console.log("Product Loading...");
                  this.loading = true;
                  const qu = query(
                      collection(firebase, 'products'),
                      where('productID', '==', this.offerData.productId)
                  );
                  const prodSnap = await getDocs(qu);
                  if (prodSnap.size > 0) {
                      this.productData = prodSnap.docs.map((doc) => doc.data())[0];
                      console.log("Product Loaded!", this.productData);
                      this.loading = false;
                  } else {
                      console.log("error");
                      this.loading = false
                  }
                },
            calcAmounts() {
                this.serviceFee = this.offerData.offerPrice * 0.06
                this.finalTotal = this.offerData.offerPrice+this.serviceFee
                console.log(this.serviceFee)
            },
            toggleDeliveryMethod(method) {
                this.deliveryMethod = method;
                if (method == 'deliver') {
                    this.deliveryName = this.$store.state.user.firstName+" "+this.$store.state.user.lastMiddleName
                    this.deliveryEmail = this.$store.state.user.email
                    this.deliveryCellNumber = this.$store.state.user.cellphoneContact
                }
            },
            async processOfferPayment(){
                this.loadingButton = true
                const newTransaction = {
                    transactionDate: new Date(), 
                    dateOfAgreement: this.offerData.timestamp,
                    productId: this.productData.productID,
                    sellerId: this.offerData.sellerId,
                    buyerId: this.offerData.buyerId,
                    offerPrice: this.offerData.offerPrice,
                    serviceFee: this.serviceFee,
                    totalAmount: this.finalTotal,
                    offerId: this.offerData.offerId,
                    transactionId: uuid.v1()
                };
                //make transaction object
                const transactionCollection = collection(firebase, 'transactions')
                const transactionRef = doc(transactionCollection,newTransaction.transactionId)
                await setDoc(transactionRef, newTransaction)

                //take buyer's money
                let balance = this.$store.state.user.balance
                balance -= this.finalTotal
                const userRef = doc(firebase, 'users', this.$store.state.user.uid)
                await updateDoc(userRef,{balance:balance})

                //add to seller's wallet
                const q = query(
                      collection(firebase, 'users'),
                      where('uid', '==', this.offerData.sellerId)
                  );
                const snapshot = await getDocs(q)
                const seller = snapshot.docs.map((doc) => doc.data())[0];
                let sellerBalance = seller.balance
                sellerBalance += newTransaction.offerPrice
                const sellerRef = doc(firebase, 'users', newTransaction.sellerId)
                await updateDoc(sellerRef,{balance:sellerBalance})

                //update the offer
                this.offerData.finalResolve = true
                const offerRef = doc(firebase,'offers',this.oID)
                await updateDoc(offerRef,this.offerData)
                

                //emit updated balances
                const updatedUserDoc = await getDoc(userRef);
                this.$emit('user-updated', updatedUserDoc.data());
                this.$store.dispatch('updateUser', updatedUserDoc.data());
                //loading done
                this.loadingButton = false
                //router push
                this.$router.push({name:'SingleOfferView', params:{id:this.offerData.offerId}})
            }

        }

    }
</script>
    
<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* This font stack is modern and professional */
  color: #333; /* Dark text for better readability */
  background-color: #f4f4f4; /* Light grey usually looks cleaner and more professional */
}

/* Style the order summary with a shadow, centering everything inside, and adding a border. */
.order-summary {
  display: flex;
  justify-content: center;
  align-items: center; /* Center the content */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Drop shadow for depth */
  border-radius: 10px; /* Rounded corners */
  overflow: hidden; /* Ensures nothing spills out of the container */
  margin: 20px;
  background-color: white; /* Creates a contrast against the background */
  flex-direction:column;
}

.delivery-details input {
  display: block; /* Elements take the full width */
  width: 100%; /* Make sure input is taking full width of the container */
  margin: 10px; /* Space between inputs */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

.delivery-method button {
  margin-right: 10px; /* Add spacing between buttons */
}

.delivery-method button:last-child {
  margin-right: 0; /* Remove right margin from the last button */
}

.left-section, .right-section {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column; /* Stack children vertically */
  justify-content: center;
  align-items: center; /* Center align the content */
}

/* Make the images more appealing */
.product-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 10px;
}

.product-image {
  width: 280px;
  height: auto;
  border-radius: 5px;
  transition: transform 0.3s ease; /* Image animation */
  margin-bottom: 10px;
}

.product-image:hover {
  transform: scale(1.05); /* Slightly increase image size on hover */
}

/* Style buttons with more engaging colors and interactive feedback. */
button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff; /* A pleasing, noticeable color */
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3; /* Darken button on hover for interactivity */
}

button.active {
  background-color: #4CAF50; /* A different color for the active state */
}

/* Responsive design for different screen sizes */
@media (max-width: 768px) {
  .order-summary {
    flex-direction: column; /* Stack sections vertically on small screens */
  }

  .left-section,
  .right-section {
    /* Adjust spacing and layout for smaller screens */
    margin-top: 5px;
  }
}

/* Style for the single image case */
.single-image {
    display: flex;
    justify-content: center;
}

/* Styles for two images side by side */
.two-images {
    display: flex;
    justify-content: space-between;
}

/* Styles for three or more images in a grid */
.three-images {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* adjust as necessary */
    gap: 10px;
}

</style>