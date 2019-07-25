import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import cartReducer from "./cart/cart.reducer";
import userReducer from "./user/user.reducer";
import shopReducer from "./shop/shop.reducer";
import directoryReducer from "./directory/directory.reducer";
import storage from "redux-persist/lib/storage";

import { store, persistor } from "./store";
// import rootReducer from "./root-reducer";

const updateCartPersistReducer = userUid => {
  const persistConfig = {
    key: userUid, // this means at what point inside of our reducer object do we want to start storage everything
    storage, // the storage key goes to whatever the storage object from redux persist we are trying to use this
    whitelist: ["cart"] // whitelist property is an array containing the string names of any of the reducer that we want to store.
    // we dont need to persist the user since it is already being handled by firebase
  };

  const rootReducer = combineReducers({
    user: userReducer, // we give the userReducer a key inside the object we pass to the combine reducer so we can access its states inside the store using the user key
    cart: cartReducer,
    directory: directoryReducer,
    shop: shopReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  store.replaceReducer(persistedReducer);

  persistor.persist();
};

export default updateCartPersistReducer;
