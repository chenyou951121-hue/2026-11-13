import { firebaseConfig } from "./firebase-config.js";

const statusElement = document.getElementById("authStatus");
const signInButton = document.getElementById("googleSignInButton");
const accountMenu = document.getElementById("accountMenu");
const accountAvatar = document.getElementById("accountAvatar");
const accountInitial = document.getElementById("accountInitial");
const accountName = document.getElementById("accountName");
const signOutButton = document.getElementById("signOutButton");

function setStatus(message) {
  statusElement.textContent = message;
}

function showError(message) {
  if (typeof window.toast === "function") {
    window.toast(message);
  } else {
    setStatus(message);
  }
}

function hasFirebaseConfig(config) {
  return ["apiKey", "authDomain", "projectId", "appId"].every((key) => {
    const value = config[key];
    return typeof value === "string" && value.trim() !== "" && !value.includes("YOUR_");
  });
}

function renderUser(user) {
  signInButton.hidden = Boolean(user);
  accountMenu.hidden = !user;

  if (!user) {
    accountAvatar.hidden = true;
    accountInitial.hidden = false;
    accountName.textContent = "";
    setStatus("尚未登入");
    return;
  }

  const label = user.displayName || user.email || "Google 使用者";
  accountName.textContent = label;
  accountInitial.textContent = [...label][0]?.toUpperCase() || "G";
  setStatus("已登入");

  if (user.photoURL) {
    accountAvatar.src = user.photoURL;
    accountAvatar.alt = `${label} 的 Google 大頭貼`;
    accountAvatar.referrerPolicy = "no-referrer";
    accountAvatar.hidden = false;
    accountInitial.hidden = true;
  } else {
    accountAvatar.removeAttribute("src");
    accountAvatar.hidden = true;
    accountInitial.hidden = false;
  }
}

function explainAuthError(error) {
  switch (error?.code) {
    case "auth/popup-closed-by-user":
      return "已關閉 Google 登入視窗。";
    case "auth/popup-blocked":
      return "瀏覽器封鎖了登入視窗，請允許此網站開啟彈出視窗。";
    case "auth/unauthorized-domain":
      return "這個網站網域尚未加入 Firebase 授權網域。";
    case "auth/operation-not-allowed":
      return "Firebase 尚未啟用 Google 登入。";
    case "auth/network-request-failed":
      return "網路連線失敗，請檢查網路後重試。";
    default:
      return "Google 登入失敗，請稍後再試。";
  }
}

if (!hasFirebaseConfig(firebaseConfig)) {
  signInButton.disabled = true;
  signInButton.title = "請先設定 firebase-config.js";
  setStatus("尚未設定 Firebase");
} else if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
  signInButton.disabled = true;
  signInButton.title = "Google 登入需要 HTTPS 或 localhost";
  setStatus("請使用 HTTPS 開啟登入");
} else {
  let firebaseModules;
  try {
    firebaseModules = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"),
    ]);
  } catch (error) {
    console.error("Could not load Firebase SDK.", error);
    signInButton.disabled = true;
    signInButton.title = "無法載入 Firebase，請檢查網路連線";
    setStatus("登入服務載入失敗");
  }

  if (firebaseModules) {
    const [{ initializeApp }, { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence }] = firebaseModules;

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (error) {
      console.warn("Could not set local Firebase Auth persistence.", error);
    }

    onAuthStateChanged(auth, renderUser, (error) => {
      console.error("Firebase Auth state error.", error);
      setStatus("無法載入登入狀態");
    });

    signInButton.addEventListener("click", async () => {
      signInButton.disabled = true;
      setStatus("正在開啟 Google 登入…");
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error("Google sign-in failed.", error);
        showError(explainAuthError(error));
        if (!auth.currentUser) setStatus("尚未登入");
      } finally {
        signInButton.disabled = false;
      }
    });

    signOutButton.addEventListener("click", async () => {
      signOutButton.disabled = true;
      try {
        await signOut(auth);
        showError("已登出 Google 帳號。");
      } catch (error) {
        console.error("Firebase sign-out failed.", error);
        showError("登出失敗，請稍後再試。");
      } finally {
        signOutButton.disabled = false;
      }
    });
  }
}
