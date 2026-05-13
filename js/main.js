(() => {
  const root = document.documentElement;
  const SESSION_KEY = "opensourcePlannerSession";

  const readSession = () => {
    try {
      return localStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  };

  const writeSession = () => {
    try {
      localStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const clearSession = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  };

  const normalizePath = (p) => p.replace(/\\/g, "/");
  const pathname = normalizePath(location.pathname);
  const currentFile = pathname.split("/").pop() || "index.html";

  if (currentFile === "planner.html" && !readSession()) {
    location.replace("./login.html");
    return;
  }

  if ((currentFile === "login.html" || currentFile === "signup.html") && readSession()) {
    location.replace("./planner.html");
    return;
  }

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    root.dataset.theme = storedTheme;
  }

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const navToggle = document.querySelector("[data-nav-toggle]");
  const navList = document.querySelector("[data-nav-list]");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navList.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.dataset.theme === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
    });
  }

  const startLink = document.querySelector("[data-start-link]");
  if (startLink) {
    const guest = startLink.getAttribute("data-href-guest") || "./pages/login.html";
    const authed = startLink.getAttribute("data-href-auth") || "./pages/planner.html";
    startLink.setAttribute("href", readSession() ? authed : guest);
  }

  const loginForm = document.querySelector('form[data-auth="login"]');
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!loginForm.checkValidity()) {
        loginForm.reportValidity();
        return;
      }
      writeSession();
      location.href = "./planner.html";
    });
  }

  const signupForm = document.querySelector('form[data-auth="signup"]');
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!signupForm.checkValidity()) {
        signupForm.reportValidity();
        return;
      }
      writeSession();
      location.href = "./planner.html";
    });
  }

  const logoutBtn = document.querySelector("[data-logout]");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      location.href = "../index.html";
    });
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const file = normalizePath(href).split("/").pop();
    if (!file) return;
    if (file === currentFile) link.classList.add("active");
  });
})();

