document.addEventListener('DOMContentLoaded', () => {
    const art3d = document.getElementById('3d');
    const photos = document.getElementById('photos');
    const footer = document.getElementById('footer');

    const htmlSnippet = `
    <div class="img">
        <img loading="lazy" src="SRC" alt="ALT" onclick="showImg(this, 'ALT', event)" class="thumbnail">
    </div>
    `;

    fetch('assets/data/3d.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to get 3d.txt. Network response was ' + response.status + ' ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split('\n');
            lines.forEach(line => {
                if(!line || line.trim() === '') return; // Skip empty lines
                let [alt, src] = line.split('|');
                if (!alt || !src) {
                    console.error('Invalid line format:', line);
                    return;
                }
                alt = alt.trim();
                src = src.trim();
                if(alt === '' || src === '') {
                    console.error('Empty alt or src:', line);
                    return;
                }
                const imgHtml = htmlSnippet.replace('SRC', src).replaceAll('ALT', alt);
                // Convert the string to a DOM node
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = imgHtml;
                const newElement = tempDiv.firstElementChild; // The <div class="img">
                // Insert it before `photos` inside `art3d`
                art3d.parentNode.insertBefore(newElement, photos);
            });
        })
        .catch(error => {
            console.error('Error fetching the file:', error);
        });

    fetch('assets/data/photography.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to get photography.txt. Network response was ' + response.status + ' ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split('\n');
            lines.forEach(line => {
                if(!line || line.trim() === '') return; // Skip empty lines
                let [alt, src] = line.split('|');
                if (!alt || !src) {
                    console.error('Invalid line format:', line);
                    return;
                }
                alt = alt.trim();
                src = src.trim();
                if(alt === '' || src === '') {
                    console.error('Empty alt or src:', line);
                    return;
                }
                const imgHtml = htmlSnippet.replace('SRC', src).replaceAll('ALT', alt);
                // Convert the string to a DOM node
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = imgHtml;
                const newElement = tempDiv.firstElementChild; // The <div class="img">
                // Insert it before `photos` inside `art3d`
                photos.parentNode.insertBefore(newElement, footer);
            });
        })
        .catch(error => {
            console.error('Error fetching the file:', error);
        });


    const overlay = document.getElementById('overlay');
    const imgContainer = overlay.querySelector('.img-container');
    const image = overlay.querySelector('img');
    image.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
        let imgs = overlay.querySelectorAll('.extraImg');
        imgs.forEach(img => {
            img.remove();
        });
        document.body.style.overflowY = 'scroll';
    });
});


function showImg(img, alt, e) {
    console.log(alt);
    const overlay = document.getElementById('overlay');
    const imgContainer = overlay.querySelector('.img-container');
    let tempImg = overlay.querySelector('img');

    const rect = img.getBoundingClientRect();
    const centerX = rect.left - (rect.left / 2);
    const centerY = (rect.top + rect.height) / 2;

    tempImg.style.transformOrigin = `${centerX}px ${centerY}px`;

    overlay.classList.add('active');
    overlay.querySelector('img').src = img.src;
    overlay.querySelector('img').style.cursor = 'pointer';
    overlay.querySelector('img').onclick = (e) => {
        e.stopPropagation();
        window.location = img.src;
    }
    document.body.style.overflowY = 'hidden';
    fetch('assets/data/' + alt + '.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to get ' + alt + '.txt. Network response was ' + response.status + ' ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split('\n');
            lines.forEach(line => {
                if(!line || line.trim() === '') return; // Skip empty lines
                let [alt, src] = line.split('|');
                if (!alt || !src) {
                    console.error('Invalid line format:', line);
                    return;
                }
                alt = alt.trim();
                src = src.trim();
                if(alt === '' || src === '') {
                    console.error('Empty alt or src:', line);
                    return;
                }
                let newImg = document.createElement('img');
                if(src.includes('youtube.com') || src.includes('youtu.be')) {
                    newImg = document.createElement('div');
                    const raw = `
                        <iframe style="width: 100%; height: 800px; border-radius: 8px; overflow: clip" src="https://www.youtube.com/embed/eW0SICkWFrw" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    `;
                    newImg.innerHTML = raw;
                    newImg = newImg.firstElementChild;
                    newImg.src = src;
                } else {
                    newImg.src = src;
                    newImg.alt = alt;
                    newImg.style.cursor = 'pointer';
                    newImg.onclick = (e) => {
                        e.stopPropagation();
                        window.location = src;
                    }
                }
                newImg.classList.add('extraImg');
                newImg.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                overlay.querySelector('.img-container').insertBefore(newImg, null);
            });
        })
        .catch(error => {
            console.error('Error fetching the file:', error);
        });
}