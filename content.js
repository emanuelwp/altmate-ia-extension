window.addEventListener('load', () => {
  generateAltForImages();
})

const generateAltForImages = async () => {
  const images = document.querySelectorAll('img');
  console.log(`Total de imagens encontradas: ${images.length}`);
  

  if (images.length === 0) {
    console.log("Nenhuma imagem encontrada na página.");
    return;
  }

  for (const img of images) {
    if (!img.alt) {
      const imageUrl = img.src;
      console.log(`Processando imagem: ${imageUrl}`);

      //USANDO A API DO GEMINI
      const response = fetch('http://localhost:3000/api/describe-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      }).then(response=>response.json()).then(({data})=>{
        img.alt = data; // Isso deve ser o campo correto do JSON recebido, ajuste se necessário
        console.log(`Alt adicionado para ${imageUrl}: ${data}`);
      }).catch((erro)=>console.log(erro));
      
    } else {
      console.log(`Imagem ${img.src} já tem alt: ${img.alt}`);
    }
  }
};


