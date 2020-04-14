(async function () {
  let response = await fetch('/list_photos');

  if (response.ok) { // если HTTP-статус в диапазоне 200-299
    // получаем тело ответа (см. про этот метод ниже)
    const json = await response.json();
    alert(json.list);
    const gallery = document.getElementsByClassName('gallery')[0];
    json.list.forEach(element => {
      const item = document.createElement('div');
      item.classList.add("gallery-item");
      const new_img = document.createElement('img');
      new_img.classList.add("gallery-image");
      new_img.src="./photo/" + element;
      item.appendChild(new_img);
      gallery.appendChild(item);
    });
  } else {
    alert("Ошибка HTTP: " + response.status);
  }
})();