# Project Setup & Webview Issue in Replit

## ⚠️ Yarn Build Issue (EAGAIN) in Replit  

When installing dependencies or building the project with Yarn in Replit, you may encounter an **`EAGAIN` error**, causing the installation to fail part-way through.  
This typically happens when Replit’s container **runs out of available resources or the network request times out**, interrupting the process.  

### ✅ Quick Fix  
Run the install command with an extended network timeout:  

```bash
yarn install --network-timeout 600000
```
This increases the allowed network time to 10 minutes, giving Replit enough time to fetch all packages and complete the build successfully.

---

## ⚠️ Webview Loading Issue in Replit  

When running this project in Replit, you may experience **slow loading times** in the Webview. 
Additionally, sometimes the styles may **not load properly**, causing the UI to look broken or unstyled.  

### ✅ Quick Fix  
If you encounter this issue, simply **reload the Webview** using the **refresh button (↻)** in the Webview panel. This should correctly apply the styles.  

Alternatively, you can open the project in a **new tab** for a smoother experience.  

---

For any further issues, feel free to report them! 🚀  