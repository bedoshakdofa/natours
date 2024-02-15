const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'your logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:5000/api/v1/users/logout',
    });
    console.log(res);
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(err.response.data.message);
    showAlert('error', 'faild to logOut try again!!!');
  }
};

const signup = async (name, email, password, passwordconfirm) => {
  console.log('hi2');
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordconfirm,
      },
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'your signup successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
document.querySelector('.nav__el--logout').addEventListener('click', () => {
  console.log('hi');
  logout();
});
document.getElementById('sginup').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  console.log('hi');
  console.log(name, email, password, passwordConfirm);
  signup(name, email, password, passwordConfirm);
});

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
