// Loads Zoho Desk's security check for the enquiry form.
(function () {
  var form = document.getElementById('enquiry');
  if (!form) return;
  var img = document.getElementById('captcha-img');
  var status = document.getElementById('form-status');
  var send = document.getElementById('enquiry-send');
  form.elements.returnURL.value = location.origin + '/thanks/';
  function loadCaptcha() {
    status.textContent = '';
    fetch('https://desk.zoho.uk/support/GenerateCaptcha?action=getNewCaptcha&_=' + Date.now())
      .then(function (r) { if (!r.ok) throw new Error('captcha'); return r.json(); })
      .then(function (d) {
        img.src = d.captchaUrl;
        form.elements.xJdfEaS.value = d.captchaDigest;
        form.elements.zsWebFormCaptchaWord.value = '';
      })
      .catch(function () {
        status.textContent = 'The security check didn’t load. Try showing different characters, or email hello@managedcreative.uk.';
      });
  }
  document.getElementById('captcha-new').addEventListener('click', loadCaptcha);
  form.addEventListener('submit', function () {
    send.disabled = true;
    send.textContent = 'Sending…';
  });
  window.addEventListener('pageshow', function () {
    send.disabled = false;
    send.textContent = 'Send enquiry';
    loadCaptcha();
  });
})();
