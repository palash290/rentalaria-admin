// $(window).on("load", function () {
//     $(".ct_loader_main").fadeOut();
//   });
$(window).on("load", function () {
  setTimeout(function () {
    $(".ct_loader_main").fadeOut();
  }, 1500); // 👈 loader 2.5 sec rahega
});

$(document).ready(function () {
  $(".ct_menu_bar").click(function () {
    $("main").addClass("ct_show");
  });
  $(".ct_close_sidebar").click(function () {
    $("main").removeClass("ct_show");
  });
  

  //   Dash Graph js S
  var options = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
    },
    series: [
      {
        name: "Revenue",
        data: [1200, 1700, 1400, 2100, 1900, 2400, 2500],
      },
    ],
    xaxis: {
      categories: ["01", "05", "10", "15", "20", "25", "30"],
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 2600,
      tickAmount: 4,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 3,
    },
    theme: {
      mode: "light",
    },
  };

  var chart = new ApexCharts(document.querySelector("#revenueChart"), options);
  chart.render();
  //   Dash Graph js E

  var owl = $(".ct_product_detail_slider");

  owl.owlCarousel({
    items: 1,
    loop: true,
    autoplay: false,
    autoplayTimeout: 3000,
    dots: false, // Disable default dots
    nav: false,
  });

  // Custom Dots Click Event
  $(".ct_dot").click(function () {
    var slideIndex = $(this).data("slide");
    owl.trigger("to.owl.carousel", [slideIndex, 300]);
  });

  // Update Active Dot on Slide Change
  owl.on("changed.owl.carousel", function (event) {
    var currentIndex =
      event.item.index - event.relatedTarget._clones.length / 2;
    $(".ct_dot").removeClass("active");
    $(".ct_dot").eq(currentIndex).addClass("active");
  });

  // Set initial active dot
  $(".ct_dot").eq(0).addClass("active");
  // Product Detail Slider js E
});
