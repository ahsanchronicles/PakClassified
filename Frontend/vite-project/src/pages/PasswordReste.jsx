import React, { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
export default function PasswordReste(props) {
  const navigate = useNavigate();
  const [recoverMode, setRecoverMode] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [passwordSetting, setPaswordSetting] = useState(false);
  const [password, setPassword] = useState({
    value: "",
    error: "",
    valid: false,
  })
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [invaidEmail, setInvalidEmail] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: "",
    valid: false,
  });
  const [question, setQuestion] = useState({
    value: "",
    error: false,
    ans: "",
  });
  const [ans, setAns] = useState({
    value: "",
    error: false,
  });
  const [email, setEmail] = useState({
    value: "",
    message: "",
    valid: false,
  });
  function handleClose() {
    goBack()
    props.setModals((prev) => ({ ...prev, passwordForgot: false }));
  }
  function verifyAnswer() {
    if (ans.value.toLowerCase() == question.ans.toLowerCase()) {
      setAns({ value: ans.value, error: false });
      setPaswordSetting(true);
    } else {
      setAns({ value: ans.value, error: true });
    }
  }
  function emailHandler(e) {
    const temp = e.target.value;
    if (temp.includes("@gmail.")) {
      setEmailCheck(false);
      setEmail({ value: temp, valid: true, message: "" });
    } else {
      setEmail({ value: temp, valid: false, message: "Invalid Email" });
    }
  }

  function goBack() {
    setRecoverMode(false);
    setEmailCheck(false);
    setInvalidEmail(false)
    setPaswordSetting(false);
    setPassword({ value: "", error: "", valid: false });
    setConfirmPassword({ value: "", error: "", valid: false });
    setQuestion({
      value: "",
      error: false,
      ans: "",
    });
    setAns({
      value: "",
      error: false,
    });
  }

  function passwordHandler(e) {
    try {
      const temp = e.target.value;
      if (temp.length <= 8)
        return setPassword({
          value: temp,
          error: "Password length must be 8 characters long",
          valid: false,
        });
      else if (!/[A-Z]/.test(temp))
        return setPassword({
          value: temp,
          error: "Capital character missing A-Z",
          valid: false,
        });
      else if (!/[!@#$%&*]/.test(temp))
        return setPassword({
          value: temp,
          error: "Special character missing !@#$%&*",
          valid: false,
        });
      else {
        setPassword({ value: temp, error: "", valid: true });
      }
    } catch (err) {
      console.log("Error in emailHandler (signup)");
      console.log(err);
    }
  }
  async function passwordCompare(e) {
    const temp = e.target.value;
    if (temp == password.value) {
      setConfirmPassword({ value: temp, error: "", valid: true });
    } else {
      setConfirmPassword({
        value: temp,
        error: "Password not match",
        valid: false,
      });
    }
  }
  async function submitUpdatePassword() {
    try {
      if (!userId || !password.value) {
        alert("Details missing!");
      }
      const payLoad = {
        id: userId,
        password: password.value,
      };
      setButtonDisabled(true);
      const res = await fetch("http://localhost:3700/api/user/password/reset", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payLoad),
      });
      if (res.ok) {
        Swal.fire({
          title: "Password Updated!",
          text: "Your password has been changed successfully! Now you can login to your account",
          icon: "success",
        });
        setButtonDisabled(false);
        goBack();
        handleClose();
      } else {
        const result = await res.json();
        alert(result.message);
        setButtonDisabled(false);
      }
    } catch (err) {
      console.error(err.message);
      alert("Failed to change password");
      setButtonDisabled(false);
    }
  }
  async function recoverViaSecurityQuestion() {
    try {
      setInvalidEmail(false)
      setUserId("")
      setButtonDisabled(true);
      if (!email.valid) {
        setEmailCheck(true);
        setButtonDisabled(false);
      } else {
        setRecoverMode(true);
        const response = await fetch("http://localhost:3700/api/user/email", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email: email.value }),
        });
        if (!response.ok) {
          if (response.status == 404) {
            setQuestion({
              value: "It look's your email is incorrect",
              error: true,
            });
            return;
          } else if (response.status == 500) {
            setQuestion({
              value: "Failed to get Security question, please try again later",
              error: true,
            });
            return;
          } else {
            setQuestion({
              value: "Failed to fetch question, try email OTP method",
              error: true,
            });
          }
        } else {
          const result = await response.json();
          setUserId(result._id);
          setQuestion({
            value: result.sequrityQuestion,
            error: false,
            ans: result.sequrityAnswer,
          });
        }
      }
    } catch (err) {
      console.log(err.message);
      setQuestion({
        value: "Network issue, please check your internet connection",
        error: true,
      });
    } finally {
      setButtonDisabled(false);
    }
  }
  async function recoverViaOTP() {
    try {
      setUserId("")
      setInvalidEmail(false)
      setButtonDisabled(true);
      if (!email.valid) {
        setEmailCheck(true);
      } else {
        const resp = await fetch(
          "http://localhost:3700/api/email/recover/otp",
          {
            method: "post",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ email: email.value }),
          }
        );
        if (!resp.ok) {
          if (resp.status === 404) {
            setInvalidEmail(true)
            setButtonDisabled(false)
          }

          return;
        } else {
                  const res=await fetch("http://localhost:3700/api/user/email",{
                    method:"post",
                    headers:{
                      "content-type":"application/json"
                    },
                    body:JSON.stringify({email:email.value})
                  })
                  const result= await res.json()
          navigate("/otp-verification", {
            state: { email: email.value, purpose: "verification", userId:result._id  },
          });
          handleClose();
          goBack();
        }
      }
    } catch (error) {
      console.log(error.message);
      alert("Something wrong in OTP function");
    } finally {
      setButtonDisabled(false);
    }
  }

  return (
    <Modal show={props.modals.passwordForgot} onHide={handleClose} centered>
      <div className="d-flex align-items-center justify-content-between border-bottom px-3 py-2">
        <h4 className="mb-0 text-success">Forgot Password</h4>
        <IoMdClose
          size={28}
          style={{ cursor: "pointer" }}
          onClick={handleClose}
        />
      </div>

      <div className="px-4 py-4 text-center">
        {recoverMode ? (
          ""
        ) : (
          <h5 className="mb-3 text-start">Enter your email below</h5>
        )}
        <input
          type="email"
          onChange={emailHandler}
          disabled={recoverMode}
          value={email.value}
          className={`p-3 mb-3 shadow-sm border ${
            emailCheck ? "border-danger border-3 text-danger" : "border"
          } rounded`}
          style={{
            width: "100%",
          }}
          placeholder="abc@gmail.com"
        />
        {recoverMode ? (
          <>
            {" "}
            {!question.error && (
              <h5 className="mb-3"> Here is your security question</h5>
            )}
            <div
              className={`border rounded p-3 mb-3 shadow-sm cursor-pointer  hover-shadow ${
                question.error ? "bg-danger text-white" : ""
              }`}
            >
              {question.value || "Loading..."}
            </div>
            {!question.error && (
              <input
                type="text"
                value={ans.value}
                disabled={passwordSetting}
                onChange={(e) =>
                  setAns({ value: e.target.value, error: false })
                }
                placeholder="Type your answer here"
                className="w-100 p-3 mb-3 shadow-sm border rounded"
              />
            )}
            {ans.error && (
              <div className="border rounded p-3 mb-3 shadow-sm text-white bg-danger">
                {" "}
                ❌ Invalid Security answer
              </div>
            )}
            {passwordSetting && (
              <>
                <h5>Enter password</h5>
                <div className="position-relative">
                  <input
                    className="p-3 mb-2 w-100 shadow-sm border rounded"
                    value={password.value}
                    onChange={passwordHandler}
                    type={showPassword ? "text" : "password"}
                    placeholder="enter password"
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "18px",
                      cursor: "pointer",
                      right: "13px",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
                {password.error && (
                  <div className="text-danger text-start">{password.error}</div>
                )}
                <input
                  type="password"
                  className="p-3 w-100 mb-2 shadow-sm border rounded "
                  value={confirmPassword.value}
                  onChange={passwordCompare}
                  placeholder="confirm password"
                />
                {confirmPassword.error && (
                  <div className="text-danger text-start">
                    {confirmPassword.error}
                  </div>
                )}
              </>
            )}
            <div className="text-end">
              {" "}
              <Button
                className="bg-warning border-warning"
                onClick={() => goBack()}
              >
                Go Back
              </Button>{" "}
              {passwordSetting && 
                <Button
                  onClick={() => submitUpdatePassword()}
                  disabled={!confirmPassword.valid || buttonDisabled}
                >
                  Save Password
                </Button>
}
                
              {!question.error && <Button onClick={verifyAnswer} disabled={question.error}>
                  Verify Answer
                </Button>}
            </div>
          </>
        ) : (
          <>
            {" "}
            <h5 className="mb-3">
              How would you like to recover your account?
            </h5>
            <p className="text-muted mb-4">
              Choose one of the secure recovery options below:
            </p>
            <div
              className="border rounded p-3 mb-3 shadow-sm cursor-pointer hover-shadow"
              style={{ transition: "0.3s" }}
            >
              <button
                className={`text-primary mb-0 fw-bold`}
                onClick={recoverViaSecurityQuestion}
                style={{ border: "none", background: "transparent" }}
                disabled={buttonDisabled}
              >
                🔒 Answer Security Question
              </button>
            </div>
            <div
              className="border rounded p-3 shadow-sm cursor-pointer hover-shadow"
              style={{ transition: "0.3s" }}
            >
              <button
                className="text-primary mb-0 fw-bold"
                style={{ border: "none", background: "transparent" }}
                onClick={recoverViaOTP}
                disabled={buttonDisabled}
              >
                📩 Recover via OTP
              </button>
            </div>
          </>
        )}
        {}
        {buttonDisabled && (
          <p className="mt-3 text-dark">Loading please wait...</p>
        )}
        {invaidEmail && <p className="mt-3 text-danger">It looks you don't have an account with this email</p>}
      </div>
    </Modal>
  );
}
