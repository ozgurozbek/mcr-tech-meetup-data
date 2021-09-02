module.exports = (head, img, title, desc, socialLinks, itemsName, itemElements, exampleNames, exampleElements, bg) => `
<!DOCTYPE html>
<html lang="en">
${head}
<body>
    <header ${ bg ? "class='background:" + bg + "'" : "" }>
        ${ img ? '<img src="' + img + '" alt="' + title + ' Image" srcset=""></img>' : "" }
        <h1>${title}</h1>
        <p>${desc}</p>
        ${ "<div class='socialLinks'>" + socialLinks.map(link => '<a href="' + link.url + '" target="_blank" rel="noreferrer"><img src="' + link.img + '" alt="' + link.name + '"></a>').join("\n") + "</div>" }
    </header>
    <main>
        <div class="items">
            <h2>${ itemsName }</h2>
            ${ itemElements }
        </div>
        <div class="items">
            <h2>${ exampleNames }</h2>
            ${ exampleElements ? exampleElements : "<p>No " + exampleNames + " Available</p>" }
        </div>
    </main>
</body>
</html>
`