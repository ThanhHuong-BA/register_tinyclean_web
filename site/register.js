(function () {
  'use strict';

  var state = {
    step: 0,
    phone: '',
    otp: '',
    password: '',
    fullName: '',
    email: '',
    storeName: '',
    address: '',
    showPassword: false,
  };

  var card = document.getElementById('card');
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));

  function isPasswordValid(pw) {
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pw || '');
  }

  function slugify(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 16) || 'cuahang';
  }

  function goToStep(n) {
    state.step = n;
    steps.forEach(function (section) {
      var match = Number(section.getAttribute('data-step')) === n;
      section.hidden = !match;
    });
    // restart fadeUp animation on the newly shown step
    var active = steps[n];
    active.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    active.offsetHeight;
    active.style.animation = '';
    render();
  }

  function setupField(name, opts) {
    opts = opts || {};
    var field = document.querySelector('.field[data-field="' + name + '"]');
    var input = field.querySelector('.field-input');

    function update() {
      var floated = document.activeElement === input || !!state[name];
      field.classList.toggle('is-floated', floated);
      field.classList.toggle('is-focused', document.activeElement === input);
    }

    input.addEventListener('input', function (e) {
      var value = e.target.value;
      if (opts.digitsOnly) value = value.replace(/[^0-9]/g, '');
      if (opts.maxLength) value = value.slice(0, opts.maxLength);
      if (value !== e.target.value) input.value = value;
      state[name] = value;
      update();
      render();
    });
    input.addEventListener('focus', update);
    input.addEventListener('blur', update);

    return { field: field, input: input, update: update };
  }

  var fields = {
    phone: setupField('phone', { digitsOnly: true }),
    otp: setupField('otp', { digitsOnly: true, maxLength: 6 }),
    password: setupField('password'),
    fullName: setupField('fullName'),
    email: setupField('email'),
    storeName: setupField('storeName'),
    address: setupField('address'),
  };

  function render() {
    var s = state;

    var phoneInvalid = s.phone.trim().length < 9;
    var otpInvalid = s.otp.trim().length !== 6;
    var passwordInvalid = !isPasswordValid(s.password);
    var formInvalid = !(s.fullName.trim() && s.storeName.trim() && s.address.trim());

    document.querySelector('[data-action="go-step-1"]').disabled = phoneInvalid;
    document.querySelector('[data-action="go-step-2"]').disabled = otpInvalid;
    document.querySelector('[data-action="go-step-3"]').disabled = passwordInvalid;
    document.querySelector('[data-action="go-step-4"]').disabled = formInvalid;

    document.querySelector('[data-text="phone-echo"]').textContent = s.phone;

    var hint = document.querySelector('[data-text="password-hint"]');
    hint.classList.toggle('is-hidden', !(!s.password || passwordInvalid));

    if (s.step === 4) {
      document.querySelector('[data-text="store-slug"]').textContent = slugify(s.storeName);
      document.querySelector('[data-text="cred-phone"]').textContent = s.phone;
      document.querySelector('[data-text="cred-password"]').textContent = s.password;
    }
  }

  document.querySelector('[data-action="back-to-step-0"]').addEventListener('click', function () {
    goToStep(0);
  });
  document.querySelector('[data-action="back-to-step-1"]').addEventListener('click', function () {
    goToStep(1);
  });
  document.querySelector('[data-action="go-step-1"]').addEventListener('click', function () {
    if (state.phone.trim().length >= 9) goToStep(1);
  });
  document.querySelector('[data-action="go-step-2"]').addEventListener('click', function () {
    if (state.otp.trim().length === 6) goToStep(2);
  });
  document.querySelector('[data-action="go-step-3"]').addEventListener('click', function () {
    if (isPasswordValid(state.password)) goToStep(3);
  });
  document.querySelector('[data-action="go-step-4"]').addEventListener('click', function () {
    var s = state;
    if (s.fullName.trim() && s.storeName.trim() && s.address.trim()) goToStep(4);
  });

  document.querySelector('[data-action="toggle-password"]').addEventListener('click', function () {
    state.showPassword = !state.showPassword;
    var input = fields.password.input;
    input.type = state.showPassword ? 'text' : 'password';
    document.querySelector('.eye-icon--on').hidden = !state.showPassword;
    document.querySelector('.eye-icon--off').hidden = state.showPassword;
  });

  function setupCopy(action, rowKey, getValue) {
    var el = document.querySelector('[data-action="' + action + '"]');
    var timer = null;
    el.addEventListener('click', function () {
      var value = getValue();
      if (navigator.clipboard) navigator.clipboard.writeText(value).catch(function () {});
      el.textContent = 'Đã sao chép';
      el.classList.add('is-copied');
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        el.textContent = 'Sao chép';
        el.classList.remove('is-copied');
      }, 1500);
    });
  }

  setupCopy('copy-store', 'store', function () { return slugify(state.storeName); });
  setupCopy('copy-user', 'user', function () { return state.phone; });
  setupCopy('copy-pass', 'pass', function () { return state.password; });

  goToStep(0);
})();
