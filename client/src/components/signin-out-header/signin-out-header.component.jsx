import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectCurrentUser,
  selectIsCheckingUser
} from "../../redux/user/user.selectors";
import { signOutStart } from "../../redux/user/user.action";

import {
  OptionDivContainer,
  OptionLinkContainer,
  SpinnerContainer
} from "./signin-out-header.styles";

const SignInOrOutHeader = ({ currentUser, isChecking, signOutStart }) =>
  isChecking ? (
    <SpinnerContainer />
  ) : currentUser ? (
    <OptionDivContainer as="div" onClick={() => signOutStart()}>
      SIGN OUT
    </OptionDivContainer>
  ) : (
    <OptionLinkContainer to="/signin">SIGN IN</OptionLinkContainer>
  );

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isChecking: selectIsCheckingUser
});

const mapDispatchToProps = dispatch => ({
  signOutStart: () => dispatch(signOutStart())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInOrOutHeader);
