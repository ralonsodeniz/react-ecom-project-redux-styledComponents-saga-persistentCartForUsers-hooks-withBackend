import { compose } from "redux";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import WithSpinner from "../../components/with-spinner/with-spiner.component";
import { selectIsCheckingUser } from "../../redux/user/user.selectors.js";
import HomePage from "./homepage.component";

const mapStateToProps = createStructuredSelector({
  isLoading: selectIsCheckingUser
});

const HomePageContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(HomePage);

export default HomePageContainer;
