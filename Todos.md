- move bezier can still break on touch
- test mix of , and . in numbers

- present nice error message when easing state is invalid
- add FAQ section for SEO and also mention API and MCP
- create openAPI specification file

- force type imports

- switch to vite + react-router
  - check if cache headers for files are set correctly by vercel

# Features

- Pause between animation preview
- Multiple curve types
- linear comparison
- ten preview modes
- CSS and Tailwind CSS code generation
- multiple accuracy levels
- optional extra space for bezier curves
- uses linear timing function instead of keyframes




Excited to announce Easing Wizard is now live! 🎉 
The ultimate CSS easing editor with support for Bézier, spring, bounce, wiggle, and overshoot! 🚀

🔗 https://easingwizard.com

Some key features are:
⚡ Uses linear timing function instead of keyframes
🎢 Multiple curve types
⏸️ Pause between animation previews
🎥 10 preview modes
📚 Large collection of presets
📝 CSS and Tailwind CSS code generation
📊 Linear comparison
🎯 Multiple accuracy levels
➕ Optional extra space for Bézier curves

And can you find the hidden easter egg?


# Links for Tests

https://easingwizard.com/?easingType=%22bezier%22&previewDuration=1250&previewAnimationType=%22width%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22HIGH%22&bezierStyle=%22inOut%22&bezierCurve=%22cubic%22&bezierRawValue=%5B0.23%2C0.99%2C0.69%2C1%5D&bezierValue=%22cubic-bezier%280.23%2C+0.99%2C+0.69%2C+1%29%22&bezierIsCustom=true
http://localhost:5173/?easingType=%22bezier%22&previewDuration=1250&previewAnimationType=%22width%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22HIGH%22&bezierStyle=%22inOut%22&bezierCurve=%22cubic%22&bezierRawValue=%5B0.23%2C0.99%2C0.69%2C1%5D&bezierValue=%22cubic-bezier%280.23%2C+0.99%2C+0.69%2C+1%29%22&bezierIsCustom=true
http://localhost:5173/#0v1250x2d.23f.69e.992D

https://easingwizard.com/?easingType=%22bezier%22&previewDuration=1250&previewAnimationType=%22width%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22HIGH%22&bezierStyle=%22inOut%22&bezierCurve=%22expo%22&bezierRawValue=%5B0.9%2C0%2C0.1%2C1%5D&bezierValue=%22cubic-bezier%280.9%2C+0%2C+0.1%2C+1%29%22&bezierIsCustom=false
http://localhost:5173/?easingType=%22bezier%22&previewDuration=1250&previewAnimationType=%22width%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22HIGH%22&bezierStyle=%22inOut%22&bezierCurve=%22expo%22&bezierRawValue=%5B0.9%2C0%2C0.1%2C1%5D&bezierValue=%22cubic-bezier%280.9%2C+0%2C+0.1%2C+1%29%22&bezierIsCustom=false
http://localhost:5173/#0v1250x2c52c

https://easingwizard.com/?easingType=%22spring%22&previewDuration=1250&previewAnimationType=%22height%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22MEDIUM%22&springCurve=%22drop%22&springStiffness=217&springDamping=16&springMass=2.5&springIsCustom=true
http://localhost:5173/?easingType=%22spring%22&previewDuration=1250&previewAnimationType=%22height%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22MEDIUM%22&springCurve=%22drop%22&springStiffness=217&springDamping=16&springMass=2.5&springIsCustom=true
http://localhost:5173/#0a1v1250x3y1i2.5j43k550y

https://easingwizard.com/?easingType=%22spring%22&previewDuration=1250&previewAnimationType=%22width%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22HIGH%22&springCurve=%22drop%22&springStiffness=50&springDamping=6&springMass=4&springIsCustom=false
http://localhost:5173/?easingType=%22spring%22&previewDuration=1250&previewAnimationType=%22width%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22HIGH%22&springCurve=%22drop%22&springStiffness=50&springDamping=6&springMass=4&springIsCustom=false
http://localhost:5173/#0a1v1250x2h23S

https://easingwizard.com/?easingType=%22bounce%22&previewDuration=550&previewAnimationType=%22moveY%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22LOW%22&bounceCurve=%22sharp%22&bounceBounces=8&bounceDamping=-0.1&bounceIsCustom=true
http://localhost:5173/?easingType=%22bounce%22&previewDuration=550&previewAnimationType=%22moveY%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22LOW%22&bounceCurve=%22sharp%22&bounceBounces=8&bounceDamping=-0.1&bounceIsCustom=true
http://localhost:5173/#0a2v550x1y0m8n480n

https://easingwizard.com/?easingType=%22bounce%22&previewDuration=1250&previewAnimationType=%22width%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22ULTRA%22&bounceCurve=%22sharp%22&bounceBounces=3&bounceDamping=1.5&bounceIsCustom=false
http://localhost:5173/?easingType=%22bounce%22&previewDuration=1250&previewAnimationType=%22width%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22ULTRA%22&bounceCurve=%22sharp%22&bounceBounces=3&bounceDamping=1.5&bounceIsCustom=false
http://localhost:5173/#0a2v1250x2y3l222

https://easingwizard.com/?easingType=%22wiggle%22&previewDuration=550&previewAnimationType=%22rotate%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22MEDIUM%22&wiggleCurve=%22subtle%22&wiggleDamping=17.4&wiggleWiggles=5&wiggleIsCustom=true
http://localhost:5173/?easingType=%22wiggle%22&previewDuration=550&previewAnimationType=%22rotate%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22MEDIUM%22&wiggleCurve=%22subtle%22&wiggleDamping=17.4&wiggleWiggles=5&wiggleIsCustom=true
http://localhost:5173/#0a3v550x5y1p5q872v

https://easingwizard.com/?easingType=%22wiggle%22&previewDuration=550&previewAnimationType=%22rotate%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22MEDIUM%22&wiggleCurve=%22dynamic%22&wiggleDamping=0&wiggleWiggles=10&wiggleIsCustom=false
http://localhost:5173/?easingType=%22wiggle%22&previewDuration=550&previewAnimationType=%22rotate%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22MEDIUM%22&wiggleCurve=%22dynamic%22&wiggleDamping=0&wiggleWiggles=10&wiggleIsCustom=false
http://localhost:5173/#0a3v550x5y1o633

https://easingwizard.com/?easingType=%22overshoot%22&previewDuration=550&previewAnimationType=%22rotate%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22HIGH%22&overshootStyle=%22out%22&overshootCurve=%22soft%22&overshootDamping=63&overshootMass=4.3&overshootIsCustom=true
http://localhost:5173/?easingType=%22overshoot%22&previewDuration=550&previewAnimationType=%22rotate%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22HIGH%22&overshootStyle=%22out%22&overshootCurve=%22soft%22&overshootDamping=63&overshootMass=4.3&overshootIsCustom=true
http://localhost:5173/#0a4v550x5t4.3u260h

https://easingwizard.com/?easingType=%22overshoot%22&previewDuration=550&previewAnimationType=%22rotate%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22HIGH%22&overshootStyle=%22out%22&overshootCurve=%22dramatic%22&overshootDamping=50&overshootMass=5&overshootIsCustom=false
http://localhost:5173/?easingType=%22overshoot%22&previewDuration=550&previewAnimationType=%22rotate%22&editorExtraSpaceTop=false&editorExtraSpaceBottom=false&editorAccuracy=%22HIGH%22&overshootStyle=%22out%22&overshootCurve=%22dramatic%22&overshootDamping=50&overshootMass=5&overshootIsCustom=false
http://localhost:5173/#0a4v550x5s42x