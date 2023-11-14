import { signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router/index.js"; 
import {createStore} from 'vuex'
import {auth, firestore} from  '@/firebase/index.js'
import { query, collection, getDocs, getDoc, where, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';


const store = createStore({
    state: {
      error : null,
      adminuser : null,
      users : [],     // if need be I would like to store all the users in the system here
      notices : [],
      notice : null,
      products : [],
      product : null,
      transactions : [],
      transaction : null,
      reviews : [],
      review : null,
      ratings : [],
      rating : null,
      communities : [],
      community : null,
      categories : [],
      loadedCommunities : false,
      category : null,
      transitioning: false,
      uploader: null,
      selectedCommunity : null,
    },

    mutations: {


      setTransitioning(state, value) {
        state.transitioning = value;
      },
      // Working with users here

      setUser(state, details)
      {
        state.adminuser = details
      },
      setUsers(state, users) {
        state.users = users;    // for setting a list of all users
    },

    setSelectedCommunity(state, community) {
      state.selectedCommunity = community;
    },

      clearAdminUser(state)
      {
        state.adminuser = null;
      },
      setUploader(state, uploader) {
        state.uploader = uploader;
      },
      clearUploader(state) {
        state.uploader = null;
      },
      
      // End of users section


      //Working with notices here
      setNotices(state, notices) {
        state.notices = notices;
      },
      removeNotice(state, noticeId) {
        state.notices = state.notices.filter((notice) => notice.id !== noticeId);
      },
      // End of notices section


      // Working with communities here
      setCommunities(state, communities) {
        state.communities = communities;
        state.loadedCommunities = true;
    },
    addCommunity(state, community) {
      state.communities.push(community);
    },
    removeCommunity(state, communityId) {
      state.communities = state.communities.filter((comm) => comm.communityId !== communityId);
  },  
      // End of communities section
      

      //Working with categories here
      setCategories(state, categories) {
        state.categories = categories;
      },
      setCategory(state, category) {
        state.category = category;
      },
      // End of categories section

      //Working with products here
      setProducts(state, products) {
        state.products = products;
      },
      setProduct(state, product) {
        state.product = product;
      },
      // End of products section
      setTransactions(state, transactions) {
        state.transactions = transactions;
      },


    },

    actions : {
      // Working with users here
      async login({ commit }, details) { // Modified to destructure the commit method from the context.
        const { email, password } = details
    
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          const user = userCredential.user;
          // Optionally, you can commit the user data here if needed.
          commit("setUser", user);
          
          if (!user) throw new Error("No user data returned by Firebase.");
          commit("setTransitioning", true);
          router.push('/');
        } catch (error) {
          switch(error.code) {
            case 'auth/user-not-found':
              alert("User not found");
              break;
            case 'auth/wrong-password':
              alert("Wrong password");
              break;
            default:
              alert("Something went wrong");
          }
        }
      },
      async logout({ commit }) {
        try {
            await auth.signOut();
            commit('clearAdminUser');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    },
    async fetchUsers({ commit }) {
      try {
          const q = query(collection(firestore, 'users'), where('role', '!=', 'admin'));    // getting all users who arent admins
          const usersSnapshot = await getDocs(q);
          const users = [];
          usersSnapshot.forEach(doc => {
              users.push({ id: doc.id, ...doc.data() });
          });
          commit('setUsers', users);
      } catch (error) {
          console.error("Error fetching users:", error);
      }
  },
  async fetchUploaderByUID({ commit }, uid) {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', uid));
      if (userDoc.exists()) {
        const uploader = { id: userDoc.id, ...userDoc.data() };
        commit('setUploader', uploader);
      } else {
        console.error("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user by UID:", error);
    }
  },

  async blockUser(uid) {
      try {
          const userRef = doc(firestore, 'users', uid);
          await updateDoc(userRef, {
              blocked: true
          });
          alert('User blocked successfully!');
      } catch (error) {
          console.error("Error blocking user:", error);
          alert('Failed to block user.');
      }
  },

  async deleteCommunity({ commit }, communityId) {
      try {
          const communityRef = doc(firestore, 'communities', communityId);
          await deleteDoc(communityRef);

          // Update the state after deletion
          commit('removeCommunity', communityId);
          
          alert('Community deleted successfully!');
      } catch (error) {
          console.error("Error deleting community:", error);
          alert('Failed to delete community.');
      }
  },
  
      // End of users section


      //Working with notices here



      async fetchNotices({ commit, state }) {
        try {
          let noticesRef;
          if (state.selectedCommunity) {
            noticesRef = query(collection(firestore, 'communitynotices'), where('communityId', '==', state.selectedCommunity.communityId));
          } else {
            noticesRef = collection(firestore, 'communitynotices'); // original code
          }
          
          const noticesSnapshot = await getDocs(noticesRef);
          const notices = [];
        
          noticesSnapshot.forEach(doc => {
            notices.push({id : doc.id, ...doc.data()});
          });
        
          commit('setNotices', notices);
        } catch (error) {
          console.error("Error fetching notices:", error);
        }
      } 
      ,
      async deleteNotice({ commit }, noticeId) {
        try {
          const noticeRef = doc(firestore, 'communitynotices', noticeId);
          await deleteDoc(noticeRef);
    
          commit('removeNotice', noticeId);
    
          alert('Notice deleted successfully!');
        } catch (error) {
          console.error('Error deleting notice:', error);
          alert('Failed to delete notice.');
        }
      },


      async fetchfilteredNotices({ commit }, uid) {
        let noticeArray = [];
        const q = query(collection(firestore, 'communitynotices'), where('userUID', '==', uid));
        const snapshot = await getDocs(q);
    
        snapshot.forEach(doc => {
            let noticeData = doc.data();
            noticeData.id = doc.id;
            noticeArray.push(noticeData);
        });
        
        commit('setNotices', noticeArray);
    },
    


      async selectCommunityAndFetchNotices({ commit, dispatch }, community) {
        commit('setSelectedCommunity', community);
        await dispatch('fetchNotices');
      },

      //... other actions above

      async increaseFeaturePoints({ state }, productId) {
        try {
            const productRef = doc(firestore, 'products', productId);
            const productDoc = await getDoc(productRef);
            const currentFeaturePoints = productDoc.data().FeaturePoints;
            await updateDoc(productRef, {
                FeaturePoints: currentFeaturePoints + 200
            });

            // Update the Vuex state
            const productToUpdate = state.products.find(p => p.id === productId);
            if (productToUpdate) {
                productToUpdate.FeaturePoints = currentFeaturePoints + 200;
            }
        } catch (error) {
            console.error("Error increasing feature points:", error);
        }
    },
    async decreaseFeaturePoints({  state }, productId) {
        try {
            const productRef = doc(firestore, 'products', productId);
            const productDoc = await getDoc(productRef);
            const currentFeaturePoints = productDoc.data().FeaturePoints;
            await updateDoc(productRef, {
                FeaturePoints: currentFeaturePoints - 200
            });

            // Update the Vuex state
            const productToUpdate = state.products.find(p => p.id === productId);
            if (productToUpdate) {
                productToUpdate.FeaturePoints = currentFeaturePoints - 200;
            }
        } catch (error) {
            console.error("Error decreasing feature points:", error);
        }
    },
      
      // End of notices section


      // trasnactions 




      // Working with communities here
      async fetchCommunities({ commit }) {
        try {
            const commsSnapshot = await getDocs(collection(firestore, 'communities'));
            const communities = [];
            commsSnapshot.forEach(doc => {
                communities.push({ communityId: doc.id, ...doc.data() });
            });
            commit('setCommunities', communities);
        } catch (error) {
            console.error("Error fetching communities:", error);
        }
    },
    async addCommunity({ commit }, community) {
      try {
        const docRef = await addDoc(collection(firestore, 'communities'), community);
        community.communityId = docRef.id;
        commit('addCommunity', community);
        alert('Community added successfully!');
      } catch (error) {
        console.error("Error adding community:", error);
        alert('Failed to add community.');
      }
    },
    
      // End of communities section
      

      //Working with categories here
      async fetchCategories({ commit }) {
        try {
          const categoriesSnapshot = await getDocs(collection(firestore, 'categories'));
          const categories = [];
          categoriesSnapshot.forEach(doc => {
            categories.push({id: doc.id, ...doc.data()});
          });
          commit('setCategories', categories);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      },
      // End of categories section

      //Working with products here
      async fetchProducts({ commit }) {
        try {
          const productsSnapshot = await getDocs(collection(firestore, 'products'));
          const products = [];
          productsSnapshot.forEach(doc => {
            products.push({id: doc.id, ...doc.data()});
          });
          commit('setProducts', products);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },
      async deleteProduct({ commit, state }, productId) {
        try {
            const productRef = doc(firestore, 'products', productId);
            await deleteDoc(productRef);
            
            // Optional: Update state after deletion
            const newProducts = state.products.filter(p => p.id !== productId);
            commit('setProducts', newProducts);
    
            alert('Product deleted successfully!');
        } catch (error) {
            console.error("Error deleting product:", error);
            alert('Failed to delete product.');
        }
    },
    async fetchProductById({ commit }, productId) {
      try {
        const productDoc = await getDoc(doc(firestore, 'products', productId));
        if (productDoc.exists()) {
          const product = { id: productDoc.productID, ...productDoc.data() };
          commit('setProduct', product);
        } else {
          console.error("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product by ID:", error);
      }
    },
    async fetchProductsByUserId({ commit }, userId) {
      try {
        const q = query(collection(firestore, 'products'), where('uploaderUID', '==', userId));
        const productsSnapshot = await getDocs(q);
        const products = [];
        productsSnapshot.forEach(doc => {
          products.push({ id: doc.id, ...doc.data() });
        });
        commit('setProducts', products);
      } catch (error) {
        console.error("Error fetching products by user ID:", error);
      }
    },
    
      
      // End of products section


      // Working with transactions here
      async fetchTransactions({ commit }) {
        try {
          const transRef = collection(firestore, 'transactions');
          const transSnapshot = await getDocs(transRef);
          const transactions = [];
    
          transSnapshot.forEach(doc => {
            transactions.push({ id: doc.id, ...doc.data() });
          });
    
          commit('setTransactions', transactions);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      },
    },

    getters : {
      // Working with users here
      // End of users section


      //Working with notices here
      // End of notices section


      // Working with communities here
      // End of communities section
      

      //Working with categories here
      // End of categories section

      //Working with products here

      // End of products section
    }
})

export default store;