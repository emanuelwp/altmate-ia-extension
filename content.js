// Adiciona o evento ao carregar a página
window.addEventListener('load', () => {
  setupNotificationContainer();
  attachFocusListenersToImages();
});

// Função para adicionar os eventos de foco às imagens
const attachFocusListenersToImages = () => {
  const images = document.querySelectorAll('img');
  console.log(`Total de imagens encontradas: ${images.length}`);

  if (images.length === 0) {
    console.log("Nenhuma imagem encontrada na página.");
    return;
  }

  for (const img of images) {
    if (!img.alt) {
      img.setAttribute('tabindex', '0'); // Torna a imagem "focável" pelo Tab
      img.addEventListener('focus', handleImageFocus);
    } else {
      console.log(`Imagem ${img.src} já tem alt: ${img.alt}`);
    }
  }
};

// Função chamada quando a imagem recebe o foco (quando o Tab está sobre a imagem)
const handleImageFocus = async (event) => {
  const img = event.target; // A imagem que recebeu o foco
  const imageUrl = img.src;
  console.log(`Processando imagem ao receber o foco: ${imageUrl}`);

  try {
    // Faz a requisição para o backend
    const response = await fetch('http://localhost:3000/api/describe-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });

    const { data } = await response.json();

    // Adiciona a descrição gerada ao atributo alt da imagem
    img.alt = data;

    // Adiciona a descrição ao atributo aria-label para reforçar a acessibilidade
    img.setAttribute('aria-label', data);

    // Notifica o leitor de tela sobre a atualização
    const notification = document.getElementById('screen-reader-notification');
    if (notification) {
      notification.textContent = `Descrição da imagem atualizada: ${data}`;
    }

    console.log(`Alt adicionado para ${imageUrl}: ${data}`);

    // Remove o event listener para evitar requisições repetidas para a mesma imagem
    img.removeEventListener('focus', handleImageFocus);
  } catch (error) {
    console.error(`Erro ao processar a imagem ${imageUrl}:`, error);
  }
};

// Adiciona um contêiner invisível para notificações ao leitor de tela
const setupNotificationContainer = () => {
  if (!document.getElementById('screen-reader-notification')) {
    const notificationDiv = document.createElement('div');
    notificationDiv.id = 'screen-reader-notification';
    notificationDiv.setAttribute('aria-live', 'polite');
    notificationDiv.style.position = 'absolute';
    notificationDiv.style.left = '-9999px'; // Torna o contêiner invisível
    document.body.appendChild(notificationDiv);
  }
};
