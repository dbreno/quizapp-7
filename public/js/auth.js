function isAuthenticated() {
  if (!getToken()) {
    window.location.href = '/signin.html';
  } else {
    return true;
  }
}

function getToken() {
  return localStorage.getItem('@quizApp:token');
}
  
function signin(token) {
  localStorage.setItem('@quizApp:token', token);

  window.location.href = '/questions.html';
}
  
function signout() {
  localStorage.removeItem('@quizApp:token');

  window.location.href = '/signin.html';
}
  
export default { isAuthenticated, getToken, signin, signout };