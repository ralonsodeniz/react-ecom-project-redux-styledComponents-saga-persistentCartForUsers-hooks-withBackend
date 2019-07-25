import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import WithSpinner from "../../components/with-spinner/with-spiner.component";
import { selectIsCheckingUser } from "../../redux/user/user.selectors.js";
import CheckoutPage from "./checkout.component";

const mapStateToProps = createStructuredSelector({
  isLoading: selectIsCheckingUser
});

const CheckoutPageContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(CheckoutPage);

export default CheckoutPageContainer;
