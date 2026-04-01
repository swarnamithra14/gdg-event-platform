# LOCAL TESTING GUIDE

## 🧪 Test Your GDG Event Platform Locally

Follow this guide to run and test the application on your computer.

---

## Method 1: Live Server (VS Code - EASIEST)

### Step 1: Install Live Server Extension
1. Open VS Code
2. Click Extensions (Ctrl+Shift+X)
3. Search "Live Server"
4. Install by Ritwick Dey

### Step 2: Start Local Server
1. Right-click on `index.html`
2. Select "Open with Live Server"
3. Browser opens automatically at `http://localhost:5500`

✅ **Done!** Your app is running locally.

---

## Method 2: Python (Built-in on Mac/Linux)

### Python 3:
```bash
cd gdg-event-platform
python -m http.server 8000
```

### Python 2:
```bash
python -m SimpleHTTPServer 8000
```

Visit: `http://localhost:8000`

---

## Method 3: Node.js (npm)

### Step 1: Install http-server
```bash
npm install -g http-server
```

### Step 2: Start Server
```bash
cd gdg-event-platform
http-server -p 8080
```

Visit: `http://localhost:8080`

---

## Method 4: PHP (Built-in on Windows)

### Step 1: Start PHP Server
```bash
cd gdg-event-platform
php -S localhost:8000
```

Visit: `http://localhost:8000`

---

## 📋 Testing Checklist

### 1. Registration Form
- [ ] Enter valid data and submit
- [ ] Check success message appears
- [ ] Try invalid email (should show error)
- [ ] Try short phone number (should show error)
- [ ] Try 1-character name (should show error)
- [ ] Form clears after successful submission
- [ ] Check participant appears in list

### 2. Form Validation
```
Test Cases:
- First Name: "A" → ❌ Fails (too short)
- First Name: "John" → ✅ Passes
- Email: "invalid" → ❌ Fails
- Email: "john@example.com" → ✅ Passes
- Phone: "123" → ❌ Fails (too short)
- Phone: "1234567890" → ✅ Passes
```

### 3. LocalStorage
- [ ] Open DevTools (F12)
- [ ] Go to Application tab
- [ ] Check LocalStorage → registrations
- [ ] Data should show all registrations
- [ ] Check LocalStorage → galleryImages
- [ ] Image data should be Base64

### 4. Image Upload
- [ ] Click on gallery upload area
- [ ] Select an image from computer
- [ ] Should show progress bar
- [ ] Image appears in gallery
- [ ] Try dragging image to upload zone
- [ ] Multiple images upload correctly
- [ ] Try deleting image (confirm dialog)
- [ ] Image removed from gallery

### 5. Countdown Timer
- [ ] Timer shows on page load
- [ ] Numbers update every second
- [ ] Format: DD:HH:MM:SS
- [ ] All numbers padded with zeros
- [ ] Open DevTools Console
- [ ] Run: `logStorageState()`
- [ ] Should show storage info

### 6. Participants List
- [ ] List shows all registrations
- [ ] Shows name, email, phone
- [ ] Shows RSVP status (Yes/No)
- [ ] Shows interests as tags
- [ ] Shows registration time
- [ ] Shows company if provided
- [ ] Shows message if provided
- [ ] Statistics update (Total, Confirmed, Not Attending)

### 7. RSVP Toggle
- [ ] Register with RSVP "Yes"
- [ ] Register with RSVP "No"
- [ ] Check status shows correctly
- [ ] Badge color changes (green for Yes, red for No)
- [ ] Statistics count updates correctly

### 8. Mobile Responsiveness
Test in DevTools Device Mode (F12 → Ctrl+Shift+M):
- [ ] iPhone 12
- [ ] iPad
- [ ] Galaxy S20
- [ ] All elements visible
- [ ] No horizontal scrolling
- [ ] Buttons clickable
- [ ] Text readable

### 9. Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari

### 10. Data Persistence
- [ ] Register participant
- [ ] Refresh page (F5)
- [ ] Data still appears
- [ ] Upload image
- [ ] Refresh page
- [ ] Image still appears
- [ ] Close browser completely
- [ ] Reopen - data still there

### 11. Clear Data Feature
- [ ] Register multiple participants
- [ ] Upload images
- [ ] Click "Clear All Data" button
- [ ] Confirm deletion
- [ ] All data removed
- [ ] Participant list empty
- [ ] Gallery empty

### 12. Error Scenarios
- [ ] Try submitting empty form
- [ ] Try uploading non-image file
- [ ] Try uploading huge image (>2MB)
- [ ] Fill LocalStorage completely
- [ ] All handled gracefully

---

## 🐛 Debugging Tips

### View Console Logs
```javascript
// Press F12, go to Console tab

// View all registered data
logStorageState()

// Clear all data
clearAllData()

// Check specific registration
localStorage.getItem('registrations')

// Check gallery images
localStorage.getItem('galleryImages')

// Check timer
updateCountdown()
```

### Check Memory Usage
```javascript
// See how much data is stored
const size = new Blob(Object.values(localStorage)).size;
console.log('Storage used:', size, 'bytes');
console.log('Storage used:', (size / 1024).toFixed(2), 'KB');
```

### Network Throttling
Test on slow connections:
1. F12 → Network tab
2. Select "Slow 3G"
3. Refresh page
4. Should still work smoothly

### Performance Profiling
1. F12 → Performance tab
2. Click Record
3. Perform actions
4. Click Stop
5. Analyze timeline

---

## 📸 Test Image Paths

Use these free images to test:

### Small Images (< 1MB):
```
https://via.placeholder.com/200x200?text=GDG+Event
https://via.placeholder.com/300x300?text=Photo+1
https://via.placeholder.com/300x300?text=Photo+2
```

Or use local images:
```
1. Save any .jpg/.png file
2. Upload through app
3. Should work instantly
```

---

## 🎯 Sample Test Data

### Sample Registration
```
First Name: John
Last Name: Doe
Email: john.doe@gmail.com
Phone: 9876543210
Company: Google
Interests: Web Development, AI/ML
RSVP: Yes
Message: Looking forward to the event!
```

### Sample Registration 2
```
First Name: Jane
Last Name: Smith
Email: jane.smith@outlook.com
Phone: 5555555555
Company: Microsoft
Interests: Cloud Computing
RSVP: No
Message: Can't make it due to prior commitment
```

---

## 🔍 Common Issues & Solutions

### Issue: Page shows blank
**Solution:**
- Check browser console (F12) for errors
- Ensure all files in same directory
- Try different browser
- Clear cache (Ctrl+Shift+Delete)

### Issue: Images don't display
**Solution:**
- Check browser LocalStorage limit
- Try smaller image (< 2MB)
- Clear old images: `localStorage.clear()`
- Check file type is valid image

### Issue: Form won't submit
**Solution:**
- Check validation errors shown
- Open console (F12) for JavaScript errors
- Inspect form fields
- Try simpler values

### Issue: Countdown timer frozen
**Solution:**
- Refresh page
- Check browser time is correct
- Open console: `updateCountdown()`
- Should show countdown values

### Issue: Styles look weird
**Solution:**
- F5 Hard Refresh (Ctrl+Shift+R)
- Clear browser cache
- Try different browser
- Check internet connection

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass
- [ ] No console errors
- [ ] Form validates correctly
- [ ] Images upload properly
- [ ] Countdown updates
- [ ] Mobile responsive
- [ ] LocalStorage working
- [ ] All features tested
- [ ] No broken links
- [ ] File names correct (index.html, styles.css, app.js)

---

## 📊 Performance Testing

### Lighthouse Score
```bash
# Chrome DevTools → Lighthouse
# Run Audit for:
# - Performance
# - Accessibility
# - Best Practices
# - SEO
```

Target Scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 85+

### Page Size
- index.html: ~15 KB
- styles.css: ~28 KB
- app.js: ~18 KB
- **Total: ~61 KB** (Fast!)

### Load Time
- Initial Load: < 1 second
- Interaction Ready: < 2 seconds

---

## 🚀 Ready to Deploy!

Once all tests pass:

1. Commit to Git
   ```bash
   git add .
   git commit -m "All tests passed - ready for deployment"
   ```

2. Follow DEPLOYMENT.md guide
3. Share your live URL
4. Celebrate! 🎉

---

## 💡 Advanced Testing

### Automated Testing (Optional)
```javascript
// Save this as test.js and run
fetch('index.html')
    .then(r => r.text())
    .then(html => {
        console.log(html.includes('GDG Event Platform')); // Should be true
    });
```

### Browser Storage Test
```javascript
// Check quota
navigator.storage.estimate().then(est => {
    console.log(`Used: ${(est.usage/1024/1024).toFixed(2)} MB`);
    console.log(`Quota: ${(est.quota/1024/1024).toFixed(2)} MB`);
});
```

---

## 📞 Need Help?

1. **Check README.md** - Full documentation
2. **Check DEPLOYMENT.md** - Deployment guide
3. **Browser DevTools** - F12 for debugging
4. **Console Logging** - `logStorageState()`
5. **GitHub Issues** - Create issue (if hosted on GitHub)

---

## 🎓 Learning Resources

- **HTML Basics:** https://developer.mozilla.org/en-US/docs/Web/HTML
- **CSS Guide:** https://developer.mozilla.org/en-US/docs/Web/CSS
- **JavaScript:** https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **Bootstrap:** https://getbootstrap.com/docs
- **LocalStorage:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

**Ready to test? Start with Method 1 (Live Server) and work through the checklist!**

Happy Testing! ✨
