function fillSlideData()
{
    for(var index in slideData["text"]) {
        $("#"+index).html(slideData["text"][index]);
    }

    for(var index in slideData["images"]) {
        $("#"+index).attr("src", slideData["images"][index]["src"]);
        $("#"+index).attr("alt", slideData["images"][index]["alt"]);
    }
}

function enhanceSpeakerImage() {
  var speakerInfo = $("img.speaker").parent();
  $(speakerInfo).corner("bite 20px");
}
