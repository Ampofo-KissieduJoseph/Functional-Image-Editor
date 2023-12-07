const fileInput = document.querySelector(".file-input"),
chooseImgBtn = document.querySelector(".choose-img"),
filterName = document.querySelector(".filter__info .name"),
filterValue = document.querySelector(".filter__info .value"),
filterSlider = document.querySelector(".slider input"),
filterOptions = document.querySelectorAll(".filter button"),
rotateOptions = document.querySelectorAll(".rotate button"),
resetFilterBtn = document.querySelector(".reset-filter"),
saveImgBtn = document.querySelector(".save-img"),
previewImg = document.querySelector(".preview__img img");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}

const loadImg = () => {
    let file = fileInput.files[0]; //get user file

    if(!file)return; //return user hasn't selected 
    previewImg.src = URL.createObjectURL(file); //Parsing file URL
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click(); //resets filter for new selected image
        document.querySelector(".container").classList.remove("disable");
    })
    // console.log(file);
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => {    //adding click event listener to all filter buttons
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness"){
            filterSlider.max ="200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }else if(option.id === "saturation"){
            filterSlider.max ="200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }else if(option.id === "inversion"){
            filterSlider.max ="100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }else{
            filterSlider.max ="100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    })
})

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");   //getting filter btn

    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;
    }else if(selectedFilter.id === "saturation"){
        saturation = filterSlider.value;
    }else if(selectedFilter.id === "inversion"){
        inversion = filterSlider.value;
    }else{
        grayscale = filterSlider.value;
    }
    applyFilters();
}

rotateOptions.forEach(option => {      
    option.addEventListener("click", () => {    //adding click event listener to all rotate buttons
        if(option.id === "left"){
            rotate -= 90;   //if clicked btn is left rotate, decrement rotate value by -90
        }else if(option.id === "right"){
            rotate += 90;   //if clicked btn is left rotate, increment rotate value by +90
        }else if(option.id === "horizontal"){
            flipHorizontal = flipHorizontal === 1 ? -1 : 1; //if flipHorizontal value is 1, set value to -1 else set 1
        }else{
            flipVertical = flipVertical === 1 ? -1 : 1; //if flipVertical value is 1, set value to -1 else set 1
        }
        applyFilters();
    });
})

const resetFilter = () => {
    //reset all variable valueto its default value
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
    rotate = 0, flipHorizontal = 1, flipVertical = 1;
    filterOptions[0].click();   //clicking brightness btn, to reset to default
    applyFilters();
}

const saveImg = () => {
    const canvas = document.createElement("canvas");    //creatng canvas element
    const ctx = canvas.getContext("2d");    // Returns a drawing context on the canvas
    canvas.width = previewImg.naturalWidth; // setting canvas width to actual image width
    canvas.height = previewImg.naturalHeight;   //setting canvas width to actual image height

    //Applying user filters to canvas filters
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2)  //translating canvas from center
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);    //flip canvas, horizontally/vertically
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
   
    const link = document.createElement("a");
    link.download = "image.jpg";    //passing <a> tag download value to image.jpg
    link.href = canvas.toDataURL();
    link.click();   //click to download image
}

fileInput.addEventListener("change", loadImg);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImg);
chooseImgBtn.addEventListener("click", () => fileInput.click());