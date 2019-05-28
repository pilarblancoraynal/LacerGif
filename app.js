var searchButton = $("#search-gif-btn");
var searchInput = $("#search-gif-input");
var favoriteTags = $(".tag");

var disabledTags = [];
var displayedGifs = [];

//SFIDA:
//1)Scrivere all'interno del campo di testo e prenderne il valore utilizzando JQuery searchInput.val()
//2)Al click del bottone Add fare una chiamata al Search endpoint fornito da giphy
//3)Aggiungere le gif fornite dalla chiamata giphy e quelle già presenti nel pannello

//Sfida:gestisce i click su elementi aggiunti di maniera dinamica:
//1)Cambiare il click handler su .tag utilizzando la sintassi imparata nella lezione precedente

searchInput.click(function(event){
    console.log(event.key);
 })
           
searchButton.click(function(event){
     var inputText = searchInput.val();
     $.getJSON({
         url: "http://api.giphy.com/v1/gifs/search?q="+ inputText +"&api_key=n2TYvewq6CUaHki40p6XdKdt1pdC0AJY",
         success: function(res){
            var gifsData =res.data; 
            var gifsWithCategory = gifsData.map(function(gif){
                var gifsWithCategory = gif;
                gifsWithCategory.category = inputText;
     
                return gifsWithCategory;
            });
     
            displayedGifs = displayedGifs.concat(gifsWithCategory);
            updateGifsHtml();
            searchInput.val("");

            var html = "";
            html += '<span class="tag is-success is-large favorite-category">';
            html += inputText;
            html += '<button class="delete is-small"></button>';
            html += '</span>';
            
            $('.tags').append(html);
         }
     })
});

$('body').on('click', '.tag', function(event){
    console.log("Hai cliccato un tag");
    $(this).toggleClass("is-success");
    $(this).toggleClass("is-danger");

    if($(this).hasClass("is-danger")){
        disabledTags.push($(this).text().trim().toLowerCase());
    } else {
        disabledTags = disabledTags.filter(function(disabledTags){
            return disabledTags = $(this).text().trim().toLowerCase();
        });
    }

    hideDisabledGifs();
    console.log(disabledTags);
});

$('body').on('click', '.tag .delete',function(event){
    event.stopPropagation();

    var category = $(this).parent().text().trim().toLowerCase();
    console.log(category);

    displayedGifs = displayedGifs.filter(function(gif){
       return gif.category != category;
    });

    updateGifsHtml();
    $(this).parent().remove();
});

$.getJSON({
 url: "http://api.giphy.com/v1/gifs/trending?api_key=n2TYvewq6CUaHki40p6XdKdt1pdC0AJY",
 success: function(res){
       var gifsData =res.data;

       var gifsWithCategory = gifsData.map(function(gif){
           var gifsWithCategory = gif;
           gifsWithCategory.category = "trending";

           return gifsWithCategory;
       });

       displayedGifs = displayedGifs.concat(gifsWithCategory);
       updateGifsHtml();
    }
});

function hideDisabledGifs(){
    displayedGifs.forEach(function(gif){
        if(disabledTags.indexOf(gif.category) >= 0){
            $("#"+ gif.id).hide();
        } else {
            $("#"+ gif.id).show();
        }
    });
}


function updateGifsHtml(){
      var html = "";
      shuffle(displayedGifs).forEach(function(gif){
      console.log(gif);
      var url = gif.images.downsized_medium.url;
      var width = gif.images.downsized_medium.width;
      var height = gif.images.downsized_medium.height;

   html += "<div class='column is-one-quarter' id="+ gif.id +">";
   html += "<img src="+ url + " width=" + width +" height=" + height + " />";
   html += "</div>";
    });

   $("#gifs-container").html(html);
  
 }

 ////algoritmo un po' + avanzato: 66) mischiare l'ordine di un array

 function shuffle(array){
     var currentIndex;
     var swapElement;
     var randomIndex;

     for(currentIndex = 0; currentIndex < array.length; currentIndex++){
         randomIndex = Math.floor(Math.random() * array.length);
         swapElement = array[currentIndex];
         array[currentIndex] = array [randomIndex];
         array[randomIndex] = swapElement;
     }

     return array;
 }