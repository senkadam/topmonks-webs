
  $(".content .tab_content").hide();
  $(".content .tab_content:first-child").show();

  $("ul li").click(function(){

  $("ul li").removeClass("active");
  $(this).addClass("active");

  var current_tab = $(this).attr("data-list");
  $(".content .tab_content").hide();
  $("."+current_tab).show();
})

  var ul = document.getElementById("tabs_ul");
  var li_tabs = ul.getElementsByTagName("li");
  for (var i = 0; i < li_tabs.length; i++) {
  li_tabs[i].addEventListener("click", function() {
    var current = ul.getElementsByClassName("active");
    current[0].className = current[0].className.replace("active", "");
    this.className += "active";

    var current_tab_value = this.getAttribute("data-list");
    document.getElementById(current_tab_value).style.display = "block";

  });
}
