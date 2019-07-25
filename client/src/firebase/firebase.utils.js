import firebase from "firebase/app"; // we import firebase app
import "firebase/firestore"; // we attach to the firebase app the database
import "firebase/auth"; // we attach to the firebase app the auth system

const config = {
  // we create the config object we copied from firebase web when we created the app
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  // this is the function we are going to use to crete the users profiles in the db
  if (!userAuth) return; // if there is not user we quit the function

  const userRef = firestore.doc(`users/${userAuth.uid}`); // we create the documentRef
  const snapShot = await userRef.get(); // we create the documentSnapshot

  if (!snapShot.exists) {
    // we check in the snapshot if the user already exists, if it doesn't we create one
    const { displayName, email } = userAuth; // we get the name and email from the google user obejct
    const createdAt = new Date(); // we create the date of registering
    try {
      await userRef.set({
        // we use the documentRef to create the new document in the collection with its properties
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }
  return userRef; // we may want to use this user reference after
};

// we create a new firebase firestore util to export our shop data to firestore
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  // we need this function to be async because we want it to the batch to finish before returning if it is resolved or rejected
  // the collectionKey will be the name of the collection and objectsToAdd all the collections object
  const collectionRef = firestore.collection(collectionKey);
  // sice firestore will be adding one collection at a time, we cannot add all the collections in the arrey at a time we need to make sure that all the collections are added, in only one fails we have to abort the process
  // this is called to do a batch and firestore has a batch() method to do this
  const batch = firestore.batch();
  // since we do not need to return an array we do not use map to iterate the array but forEach, that will perform certain actions using every element of the array and it does not return anything unless we say it
  objectsToAdd.forEach(collectionObject => {
    const newDocRef = collectionRef.doc(); // .doc() will tell firebase to give (create) a new document reference in this collection (in the current path) and randomly generate an unique id for it | if inside of doc(string) we pass a string we can set the id we want, for example the collection object title, but we want the unique id
    // now we want to set the collections inside the new documents, which are referenced to the path where they were created in the previous line of code
    // as we want them to be all created or not we use the write batch as
    batch.set(newDocRef, collectionObject);
  });
  // the batch is created but has to be fired (executed) so now we fire it off
  return await batch.commit(); // .commit() returns a promise which its resolved value is null
};

// now we will create a function that gets the whole collection snapshot and treats the data so we transforms it into an object instead of the array we would get with .docs and it is returned as our front end needs it to be
export const convertCollectionsSnapshotToMap = collections => {
  return collections.docs.reduce((accumulator, documentCollection) => {
    // we get the documentSnapshots from the collectionSnapshot .docs properties and using reduce we create the object with the structure we need
    const { title, items } = documentCollection.data(); // we use .data() to get the items inside the document
    accumulator[title.toLowerCase()] = {
      // we are saying to the accumulator objects property with key collection.title to contain the collection itself. for example accumulator = {hats: { title: "hats", routName: "hats", id: "1241kh4141", items: [Array of hats items]}}
      routeName: encodeURI(title.toLowerCase()), // what encodeURI does is you pass it some string and it give you back a string in which any character a url cannot handle or process are converted into a version that the url can actually read | we use it here because routeName is something we are going to use in routing in our urls
      id: documentCollection.id, // id we get it from the document snapshot itslef
      title,
      items
    };
    return accumulator; // since we are introducing a new different property in the object each iteration we don't need to control not to overwrite the previous iteration
  }, {});
};

// this is the same as above but using two iteration methods, map to create the collection object as we need and reduce to return an object with the collections inside instead of an array
// export const convertCollectionSnapshotToMap = collections => {
//   const transformedCollections = collections.docs.map(documentCollection => {
//     const { title, items } = documentCollection.data();
//     return {
//       routeName: encodeURI(title.toLowerCase()),
//       id: documentCollection.id,
//       title,
//       items
//     };
//   });
//   return transformedCollections.reduce((accumulator, collection) => {
//     accumulator[collection.title.toLowerCase()] = collection;
//     return accumulator;
//   }, {});
// };

// util to check if there is a user logged in on App mount
// we have to mimic the functionality we may encounter when we do not have firebase as the backend
// we will use onAuthStateChange to check if there is a user logged in and if so to get it and just after that we close the observable listener
// we need it in a Promise pattern since our sagas need the promise to yield
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      // onAuthStateChanged or onSnapshot take a succeed and an optional on error
      unsubscribe(); // we close the listener with the method returned from onAuthStateChanged
      resolve(userAuth); // if we have an user logged in we get the userAuth and we return it, if there is not user logged we will return null as the userAuth will be empty
    }, reject); // if there is any errro we use reject as the second parameter of onAtuhStateChanged so we can catch it with our saga
  });
};

firebase.initializeApp(config); // we initialize the App using the config object

export const auth = firebase.auth(); // we start to config the auth process
export const firestore = firebase.firestore(); // we start the config of the db

// start with google auth
export const googleProvider = new firebase.auth.GoogleAuthProvider(); // this give us acceess to google auth provider
googleProvider.setCustomParameters({ prompt: "select_account" }); // here we set custom parameters of the google auth | prompt: "select_account" we want to always trigger the google pop up for auth and sign in
// we are not using this function now since we are doing this process inside the user signin with google saga
// export const signInWithGoogle = () => auth.signInWithPopup(googleProvider); // this sets that we want to signin with the google pop up

export default firebase;
