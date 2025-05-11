document.addEventListener('DOMContentLoaded', () => {
    const art3d = document.getElementById('3d');
    const photos = document.getElementById('photos');

    const htmlSnippet = `
    <div class="img">
        <img loading="lazy" src="SRC" alt="ALT">
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
                const imgHtml = htmlSnippet.replace('SRC', src).replace('ALT', alt);
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

   /*
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlSnippet;
    const newElement = tempDiv.firstElementChild; // The <div class="img">
    */

    // Insert it before `photos` inside `art3d`
    /*art3d.parentNode.insertBefore(newElement, photos);*/

});