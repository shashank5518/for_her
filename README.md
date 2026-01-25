# Valentine's Day Love Letter Website 💜

A beautiful, interactive Valentine's Day webpage with a Tangled-inspired dark purple and lantern theme.

## Features

- ✨ Beautiful handwritten font love letter
- 🏮 Floating lanterns animation (Tangled-inspired)
- 🎵 Background music player
- 📸 Photo/video gallery with smooth popup
- 💜 Interactive elements and animations
- 📱 Fully responsive (iPhone, iPad, Laptop)
- 🎨 Custom scrollbars matching the theme
- ✨ Click anywhere for heart animations

## How to Use

### 1. Add Background Music

Open `script.js` and find this line (around line 5):
```javascript
// backgroundMusic.src = 'your-music-file.mp3';
```

Uncomment it and add your music file path:
```javascript
backgroundMusic.src = 'music/valentines-song.mp3';
```

Make sure your music file is in the same folder or provide the correct relative path.

### 2. Add Photos/Videos to Gallery

Open `index.html` and find the gallery section (around line 60). Add your photos/videos like this:

**For Images:**
```html
<div class="gallery-item" data-type="image">
    <img src="photos/memory1.jpg" alt="Our Memory">
</div>
```

**For Videos:**
```html
<div class="gallery-item" data-type="video">
    <video src="videos/memory1.mp4" alt="Our Memory"></video>
</div>
```

You can add as many as you want! The gallery will automatically arrange them in a grid.

### 3. Customize the Love Letter

Edit the love letter content in `index.html` (around lines 40-60). The text uses a handwritten font and you can personalize it however you want!

### 4. Change the Name

In `index.html`, find the signature section and change "Your Love" to your name:
```html
<span class="name">Your Name</span>
```

## File Structure

```
new_proj/
├── index.html      # Main HTML file
├── styles.css      # All styling and animations
├── script.js       # Interactive functionality
└── [your music file]
└── [your photos/videos]
```

## Opening the Website

Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

## Tips

- Make sure all your image/video files are in the same folder or use correct relative paths
- For best results, use images that are at least 500x500 pixels
- Music files should be in MP3 format for best browser compatibility
- The website works offline once all files are downloaded

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Enjoy creating your special Valentine's Day surprise! 💜✨
