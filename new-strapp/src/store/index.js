import {createStore} from 'vuex'
import router from '../router'
import {auth, firebase} from  '../firebase/index.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail} from 'firebase/auth'



const store = createStore({
  state: {
    user: null,
    error: null,
    notice : null,
    transactionData: null,
  },
  mutations: {

    // Users

    setUser(state, details)
    {
      state.user = details


    },
    ClearUser(state)
    {
      state.user = null
    },


    // Community Notices

    setNotice(state, details)
    {
      state.notice = details
    },

    clearNotice(state)
    {
      state.notice = null
    },

    //transaction and ratings:
    setTransactionData(state, data) {
      state.transactionData = data;
    },

  },
  actions: {

    //transactions and reviews
    updateTransactionData({ commit }, data) {
      commit('setTransactionData', data);
    },

    updateUser({ commit }, updatedUser) {
      commit('setUser', updatedUser);
    },

    // Messaging 
    async markMessageAsRead({ commit }, messageId) {
      try {
        // Mark the message as read in Firestore
        await firebase.collection('messages').doc(messageId).update({
          isRead: true,
        });
  
        // Commit a mutation to update the message's read status in the Vuex store if necessary
        commit('markMessageAsRead', messageId);
      } catch (error) {
        console.error('Error marking message as read:', error);
        throw error;
      }
    },
  
    async handleNewMessage({ commit }, newMessage) {
      try {
        // Add the new message to Firestore
        await firebase.collection('messages').add(newMessage);
  
        // Commit a mutation to update the state in the Vuex store if necessary
        commit('addNewMessage', newMessage);
      } catch (error) {
        console.error('Error adding new message:', error);
        throw error;
      }
    },

    // Users
    
    async signup(context, { email, password }) {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      if (user) {
        context.commit('setUser', user);
        return user; 
      } else {
        throw new Error('could not complete signup');
      }
    },

       async login ({ commit }, details) {
        const { email, password } = details
  
        try {
          await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
          switch(error.code) {
            case 'auth/user-not-found':
              alert("User not found")
              break
            case 'auth/wrong-password':
              alert("Wrong password")
              break
            default:
              alert("Something went wrong")
          }
          return
        }
  
        commit('setUser', auth.currentUser)
  
        router.push('/')
      },

      async sendPasswordReset(_, email) {
        try {
          await sendPasswordResetEmail(auth, email);
        } catch (error) {
          console.error("Error sending password reset email:", error);
          throw error;
        }
      },
  
  
      async logout({ commit }) {
        try {
          await signOut(auth);
      
          commit("ClearUser");
    
          router.push("/login");
        } catch (error) {
//catch
        }
      },

      async updateProfile ({commit}) {
        commit('UpdateUser')
      },



      // Notices 

      async uploadnotice(context, {model})
      {
        // code for uploadnotice
        if (model)
        {
          context.commit('setNotice', model)
        }
      },

      async editnotice(context, { model})
      {
        // code for uploadnotice
        if(model)
        {
          context.commit('setNotice', model)
        }
        else {
          console.log('this should have happened')
        }
      },

      async delettenotice(context)
      {
        context.commit('clearNotice')
      }      
    },  
    getters: {

      // Users
      thisUser: state => state.user,

      // Notices 

      thisNotice: state => state.notice,

      error: state => state.error,

      getTransactionData: (state) => state.transactionData,
    }
  });

export default store;