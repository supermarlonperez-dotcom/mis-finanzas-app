(function () {
  "use strict";

  if (!window.supabase || !window.SUPA_URL || !window.SUPA_KEY) {
    document.getElementById("authLoading").textContent = "No se pudo cargar la conexión. Recargá la página.";
    return;
  }

  var sb = window.supabase.createClient(window.SUPA_URL, window.SUPA_KEY);
  window.sb = sb;

  document.getElementById("authMark").innerHTML =
    '<svg class="icon" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M3 6.5A1.5 1.5 0 014.5 5h10A1.5 1.5 0 0116 6.5V15a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 013 15V6.5z"/>' +
    '<path d="M3 8h13.5a1 1 0 011 1v2.4a1 1 0 01-1 1H14a1.7 1.7 0 010-3.4h2.5"/></svg>';

  var loadingEl = document.getElementById("authLoading");
  var authEl = document.getElementById("authScreen");
  var appEl = document.getElementById("app");
  var userChip = document.getElementById("userChip");
  var userEmail = document.getElementById("userEmail");
  var authPanel = document.getElementById("authPanel");
  var resetPanel = document.getElementById("resetPanel");
  var authSub = document.getElementById("authSub");
  var modeToggle = document.getElementById("authModeToggle");
  var passwordField = document.getElementById("authPasswordField");
  var forgotLink = document.getElementById("forgotLink");
  var backToSigninLink = document.getElementById("backToSigninLink");
  var msgEl = document.getElementById("authMsg");
  var submitBtn = document.getElementById("authSubmit");
  var mode = "signin";

  // Si el link del correo de recuperación ya trae el token en la URL, no
  // mostrar ni por un instante la app o el login normal: nos quedamos en
  // "Cargando…" hasta que llegue el evento PASSWORD_RECOVERY.
  var arrivingFromRecoveryLink = /type=recovery/.test(window.location.hash);

  function setMode(next){
    mode = next;
    document.querySelectorAll('[data-mode]').forEach(function (b) { b.classList.toggle("active", b.dataset.mode === mode); });
    msgEl.className = "auth-msg";
    msgEl.textContent = "";
    if (mode === "forgot") {
      modeToggle.hidden = true;
      passwordField.style.display = "none";
      document.getElementById("authPassword").required = false;
      forgotLink.hidden = true;
      backToSigninLink.hidden = false;
      authSub.textContent = "Poné tu email y te mandamos un link para elegir una contraseña nueva.";
      submitBtn.textContent = "Enviar link de recuperación";
    } else {
      modeToggle.hidden = false;
      passwordField.style.display = "";
      document.getElementById("authPassword").required = true;
      forgotLink.hidden = false;
      backToSigninLink.hidden = true;
      authSub.textContent = "Iniciá sesión para ver tus datos, sincronizados entre todos tus dispositivos.";
      submitBtn.textContent = mode === "signup" ? "Crear cuenta" : "Iniciar sesión";
    }
  }

  document.querySelectorAll('[data-mode]').forEach(function (btn) {
    btn.addEventListener("click", function () { setMode(btn.dataset.mode); });
  });
  forgotLink.addEventListener("click", function () { setMode("forgot"); });
  backToSigninLink.addEventListener("click", function () { setMode("signin"); });

  function translateError(message) {
    if (/already registered|already exists/i.test(message)) return "Ese email ya tiene una cuenta. Probá iniciar sesión.";
    if (/invalid login credentials/i.test(message)) return "Email o contraseña incorrectos.";
    if (/password should be at least/i.test(message)) return "La contraseña debe tener al menos 6 caracteres.";
    if (/email not confirmed/i.test(message)) return "Confirmá tu email antes de iniciar sesión (revisá tu correo, incluida la carpeta de spam).";
    if (/unable to validate email/i.test(message)) return "Ese email no es válido.";
    if (/same password/i.test(message)) return "Esa es la misma contraseña que ya tenías. Elegí una distinta.";
    return message;
  }

  document.getElementById("authForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("authEmail").value.trim();
    var password = document.getElementById("authPassword").value;
    msgEl.className = "auth-msg";
    msgEl.textContent = "";
    submitBtn.disabled = true;

    if (mode === "forgot") {
      sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + window.location.pathname }).then(function (res) {
        submitBtn.disabled = false;
        if (res.error) {
          msgEl.className = "auth-msg error";
          msgEl.textContent = translateError(res.error.message);
          return;
        }
        msgEl.className = "auth-msg ok";
        msgEl.textContent = "Listo. Si ese email tiene cuenta, le va a llegar un link para elegir contraseña nueva (revisá spam también).";
      })["catch"](function () {
        submitBtn.disabled = false;
        msgEl.className = "auth-msg error";
        msgEl.textContent = "Error de conexión. Probá de nuevo.";
      });
      return;
    }

    var action = mode === "signup"
      ? sb.auth.signUp({ email: email, password: password })
      : sb.auth.signInWithPassword({ email: email, password: password });

    action.then(function (res) {
      submitBtn.disabled = false;
      if (res.error) {
        msgEl.className = "auth-msg error";
        msgEl.textContent = translateError(res.error.message);
        return;
      }
      if (mode === "signup" && res.data && !res.data.session) {
        msgEl.className = "auth-msg ok";
        msgEl.textContent = "Cuenta creada. Revisá tu correo para confirmar antes de iniciar sesión.";
        return;
      }
      // Con sesión activa, onAuthStateChange se encarga de mostrar la app.
    })["catch"](function () {
      submitBtn.disabled = false;
      msgEl.className = "auth-msg error";
      msgEl.textContent = "Error de conexión. Probá de nuevo.";
    });
  });

  var resetMsgEl = document.getElementById("resetMsg");
  document.getElementById("resetForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var p1 = document.getElementById("resetPassword").value;
    var p2 = document.getElementById("resetPassword2").value;
    resetMsgEl.className = "auth-msg";
    resetMsgEl.textContent = "";
    if (p1 !== p2) {
      resetMsgEl.className = "auth-msg error";
      resetMsgEl.textContent = "Las dos contraseñas no coinciden.";
      return;
    }
    var btn = e.target.querySelector("button[type=submit]");
    btn.disabled = true;
    sb.auth.updateUser({ password: p1 }).then(function (res) {
      btn.disabled = false;
      if (res.error) {
        resetMsgEl.className = "auth-msg error";
        resetMsgEl.textContent = translateError(res.error.message);
        return;
      }
      window.history.replaceState(null, "", window.location.pathname);
      sb.auth.getSession().then(function (r) {
        var session = r.data && r.data.session;
        if (session) showApp(session); else showAuth();
      });
    })["catch"](function () {
      btn.disabled = false;
      resetMsgEl.className = "auth-msg error";
      resetMsgEl.textContent = "Error de conexión. Probá de nuevo.";
    });
  });

  document.getElementById("logoutBtn").addEventListener("click", function () {
    sb.auth.signOut();
  });

  function showApp(session) {
    loadingEl.style.display = "none";
    authEl.style.display = "none";
    appEl.style.display = "";
    userChip.style.display = "flex";
    userEmail.textContent = session.user.email || "";
    window.Store.connect(sb, session.user.id);
  }

  function showAuth() {
    loadingEl.style.display = "none";
    appEl.style.display = "none";
    userChip.style.display = "none";
    authEl.style.display = "flex";
    authPanel.hidden = false;
    resetPanel.hidden = true;
    setMode("signin");
    window.Store.disconnect();
  }

  function showResetPassword() {
    loadingEl.style.display = "none";
    appEl.style.display = "none";
    userChip.style.display = "none";
    authEl.style.display = "flex";
    authPanel.hidden = true;
    resetPanel.hidden = false;
  }

  if (!arrivingFromRecoveryLink) {
    sb.auth.getSession().then(function (res) {
      var session = res.data && res.data.session;
      if (session) showApp(session); else showAuth();
    });
  }

  sb.auth.onAuthStateChange(function (event, session) {
    if (event === "PASSWORD_RECOVERY") {
      showResetPassword();
      return;
    }
    if (resetPanel && !resetPanel.hidden) return; // ya está eligiendo la nueva contraseña, no la interrumpas
    if (session) showApp(session); else showAuth();
  });
})();
