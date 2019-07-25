import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import HomePageContainer from "./pages/homepage/homepage.container";
import ShopPage from "./pages/shop/shop.component";
import Header from "./components/header/header.component";
import SignInAndUpPageContainer from "./pages/sign-in-and-up/sign-in-and-up.container";
import CheckoutPage from "./pages/checkout/checkout.component";
// we dont need firebase utils anymore in App.js since we are doing all the auth related code in sagas
// import {
//   auth,
//   createUserProfileDocument
//   // addCollectionAndDocuments only needed to update the collections in the firestore
// } from "./firebase/firebase.utils"; // we need this to make our app aware of a google auth process
import { checkUserSessionStart } from "./redux/user/user.action"; // in order to dispatch the action and be able to use it as a prop we need to import it
import { selectCurrentUser } from "./redux/user/user.selectors";
// import { selectCollectionsForPreview } from "./redux/shop/shop.selectors"; | we only need this selector when we need to udpate collections in firestore | this selector returns an array with the objects of the different collections

// import "./App.css"
import { GlobalStyle } from "./global.styles";

const App = ({ checkUserSessionStart, currentUser }) => {
  // since we don't need state anymore nor to use the props inside the constructor  we don't need them

  // <- WE ARE CHANGING OUR AUTH CODE TO ADDAPT IT INTO SAGAS ->
  // we create the methods to close the listeners we open have a channel to communicate with the db for different pourposes
  // unsubscribeFromAuth = null;
  // unsubscribeFromSnapshot = null; // we will have to close the listener that we are going to start to know when a new snapshot is done

  // componentDidMount() {
  // const { setCurrentUser } = this.props; //     const { setCurrentUser, collectionsArray } = this.props; we only need collectionsArray when we use addCollectionAndDocuments() to update collections document in firestore
  // this is a method in the auth library that registers when a user changes in the firebase auth
  // it's going to be a async since we potentially have to do api calls to our db to get the users registered
  // this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
  //   // here we execute auth.onAuthStateChanged() and store what it returns, that is an unsubscribe function that ends the listener
  //   if (userAuth) {
  //     // we check if t he userAuth object is not null
  //     const userRef = await createUserProfileDocument(userAuth); // we save the returned userRef object from the firestore with the id of the user that has loggedin
  //     this.unsubscribeFromSnapshot = userRef.onSnapshot(snapShot => {
  //       // onSnapshot, as onAuthStateChanged, adds a listener for documentSnapshot and triggers an action when it happens
  //       // we are replacing this.setState({currentUser:{whatever}}) evrywhere we want to update currentUser in the store with this.props.setCurrentUser({whatever}) (we dont need the currentUser neither because thets what the action modifies itself) since thats what this action does
  //       setCurrentUser({
  //         id: snapShot.id, // we get the id of the registered user from the documentSnapshot
  //         ...snapShot.data() // since the properties of the docuemnt are not in the documentSnapshot we get them with the .data() method of documentSnapshot and we spread it into the currentUser object from the state
  //       });
  //     });
  //   } else {
  //     setCurrentUser(userAuth); // if the user logs out or it is null because any other reason we set the currentUser to null (we know in this case userAuth is going to be null)
  //   }
  //   // we use this function to update our collection only when we know we have made changes to it in the shop.data.js
  //   // if we leave it unccommented everytime we load the app new documents would be added to the collection
  //   // when we update the shop data we have to remove the documents inside the collections collection and then run this function once
  //   // addCollectionAndDocuments(
  //   //   "collections", // name of the collection we want to create
  //   //   collectionsArray.map(({ title, items }) => ({ title, items })) // we don't need all the elements inside the collections just the title and the items so we create a new array in which we get the title and items of the collection in each iteration and return a new array of objects with those two properties
  //   // );
  // });
  // }

  // componentWillUnmount() {
  //   this.unsubscribeFromAuth(); // and then we use it in the componentWillUnmount to close the subscription
  //   this.unsubscribeFromSnapshot();
  // }
  // <- END OF ASYNC CODE WITHOUT SAGAS ->

  // we replace componentDidMount with useEffect
  useEffect(() => {
    checkUserSessionStart();
  }, [checkUserSessionStart]); // react hooks demands checkUserSessions to be in the array since it is a dependency of the function, since it is a user action function that does not change its ok, we will have to check what to do when it is a property that comes from a parent component because it is different
  // this will only load when the component is mount since checkUserSession is not going to change

  // componentDidMount() {
  //   checkUserSession();
  // }

  return (
    <div>
      {/* first component we add is the GlobalStyle component to apply the styles inside globally */}
      <GlobalStyle />
      <Header />
      <Switch>
        <Route exact path="/" component={HomePageContainer} />
        <Route path="/shop" component={ShopPage} />
        {/* we keep /shop without exact because we want it to be rendered when we access to pages derivated from shop as /shop/hats etc to for example fetch our collection data from firestore */}
        {/* the shop page is rendered and ontop of it renders the components of the categoryId */}
        <Route
          exact
          path="/signin"
          render={() =>
            currentUser ? <Redirect to="/" /> : <SignInAndUpPageContainer />
          }
        />
        {/* what we have done here is to conditionally render one of two components depending if currentUser exists or not */}
        {/* <Redirect> router component allow us to change the path of a route to a new one so we can avoid to show sign in page when a user is logged in */}
        <Route exact path="/checkout" component={CheckoutPage} />
      </Switch>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
  // collectionsArray: selectCollectionsForPreview | we only need collectionsArray: selectCollectionsForPreview when we use addCollectionAndDocuments() to update collections document in firestore
});

const mapDispatchToProps = dispatch => ({
  checkUserSessionStart: () => dispatch(checkUserSessionStart()) // dispatch is a way for redux to know that whatever you pass to this function is going to be an action object that is going to be passed to every reducer
  // we returning an object which its property is a function that dispatchs the action with the requested parameter, in this case the user
  // once we need to use the action inside the component we will do this.props.setCurrentUser(user)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
