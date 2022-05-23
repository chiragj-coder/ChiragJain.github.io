/*jslint browser:true */
$(document).ready(function() {
  var $body = $("body");
  var $navbar = $(".navbar-default");
  var $offsetY = $navbar.offset().top + 10;
  var $menuButton = $("button.navbar-toggle");
  var $menuIcon = $(".navbar-toggle .glyphicon");
  var $collapsedMenuItem = $(".navbar-collapse.collapse li");
  var $modalBackdropDiv = $('<div class="modal-backdrop fade in"></div>');
  var $scrollButton = $(".scroll");
  var $socialIcon = $(".social");
  var $alertBox = $("#status");
  var $slides = $(".slides");
  var $sliderNav = $(".slider-nav");

  // -----------------------
  // Fixed Nav After Scroll
  // -----------------------
  function scroll() {
    if ($(window).scrollTop() >= $offsetY) {
      $navbar
        .addClass("menu-fixed")
        .css("background-color", "rgba(255,254,253,0.97)");
    } else {
      $navbar.removeClass("menu-fixed").css("background-color", "transparent");
    }
  }
  document.onscroll = scroll;

  // -----------------------
  // Mobile Menu Functions
  // -----------------------
  function openMenu() {
    $menuIcon
      .removeClass("glyphicon-menu-hamburger")
      .addClass("glyphicon-remove active");
    $modalBackdropDiv.css("z-index", 900);
    $body.append($modalBackdropDiv);
    if (!$navbar.hasClass("menu-fixed")) {
      $navbar.css("background-color", "rgba(255,254,253,0.97)");
    }
    // Close menu after clicking modal-backdrop
    $modalBackdropDiv.on("click", function() {
      $(".navbar-toggle").click();
      closeMenu();
    });
  }
  function closeMenu() {
    $menuIcon
      .removeClass("glyphicon-remove active")
      .addClass("glyphicon-menu-hamburger");
    $modalBackdropDiv.css("z-index", 1025).remove();
    if (!$navbar.hasClass("menu-fixed")) {
      $navbar.css("background-color", "transparent");
    }
  }
  // Mobile Menu Icon Toggle
  $menuButton.on("click", function() {
    if ($menuIcon.hasClass("glyphicon-menu-hamburger")) {
      openMenu();
      // Close menu after clicking a link
      $collapsedMenuItem.on("click", function() {
        $(".navbar-toggle").click(); // Trigger collapse animation
        closeMenu();
      });
    } else {
      closeMenu();
    }
  });
  // Collapse menu on resize
  $(window).resize(closeMenu());

  // -------------------------
  // Smooth Scroll to Content
  // -------------------------
  $scrollButton.on("click", function(e) {
    e.preventDefault();
    var $link = $(this).attr("href");
    $("html, body").animate(
      {
        scrollTop: $($link).offset().top - 59
      },
      900
    );
  });

  // --------------------------
  // Social Icons Hover Effect
  // --------------------------
  // Swap out images on hover or focus
  $socialIcon.on({
    "focus mouseenter": function() {
      var $iconImg = $(this).children();
      // Remove 'black.svg' from end and add 'color.svg'
      var $href = $iconImg.attr("src").slice(0, -9) + "color.svg";
      $iconImg.attr("src", $href);
    },
    "blur mouseleave": function() {
      var $iconImg = $(this).children();
      var $href = $iconImg.attr("src").slice(0, -9) + "black.svg";
      $iconImg.attr("src", $href);
    }
  });

  // --------------------------
  // Center Modals Vertically
  // --------------------------
  function centerModal() {
    $(this).css("display", "block");
    var $dialog = $(this).find(".modal-dialog");
    var $offset = ($(window).height() - $dialog.height()) / 2;
    var $bottomMargin = parseInt($dialog.css("margin-bottom"), 10);
    // If modal is taller than screen height, top margin = bottom margin
    if ($offset < $bottomMargin) {
      $offset = $bottomMargin;
    }
    $dialog.css("margin-top", $offset);
  }
  $(document).on("show.bs.modal", ".modal", centerModal);
  $(window).on("resize", function() {
    $(".modal:visible").each(centerModal);
  });

  // --------------------------
  // Contact Form Submission
  // --------------------------
  // Hide alert box when closing (instead of the default action of removing the element)
  $alertBox.children(".close").on("click", function() {
    // Animate close
    $(this)
      .parent()
      .slideUp("fast")
      .animate({ opacity: 0 }, { queue: false, duration: "fast" });
  });

  function showResponse(msg) {
    // First, remove alert classes
    $alertBox.removeClass("alert-success alert-warning");
    // Check if a successful message was returned
    if (msg.includes("Message sent successfully!")) {
      $alertBox.addClass("alert-success");
      // Trim off error text to leave only thank you message
      msg = msg.substr(msg.indexOf("Message sent"));
      // Clear contact form
      $("#contactForm")[0].reset();
    } else {
      $alertBox.addClass("alert-warning");
    }
    // Insert response message
    $alertBox.children("p").html(msg);
    // Animate open
    $alertBox
      .slideDown("fast")
      .animate({ opacity: 1 }, { queue: false, duration: "fast" });
  }

  // Submit Form
  function submitForm() {
    var request = $.ajax({
      type: "POST",
      url: "/inc/mail.php",
      data: $("#contactForm").serialize()
    });
    request.done(function(msg) {
      showResponse(msg);
    });
    request.fail(function(xhr, status, error) {
      showResponse(error);
      console.warn(error);
    });
  }

  // Send Message on Submit
  $("#sendMessage").on({
    "click submit": function(e) {
      // Cancels form submission
      e.preventDefault();
      submitForm();
    }
  });

  // --------------------------
  // Slider Nav
  // --------------------------
  function disableSiblings(e) {
    // $sliderNav.children().removeClass("active");
    e.siblings().removeClass("active");
  }
  // Have 1st child active on load
  $sliderNav.children(":first-child").addClass("active");
  $slides.children(":first-child").addClass("active");

  // Change active class on click
  $sliderNav.children().on("click", function(e) {
    var $link = $(this).attr("href");
    var $slides = $(this)
      .parent()
      .siblings();
    e.preventDefault();
    disableSiblings($(this));
    $(this).addClass("active");
    // Look through slides for id that matches $link
    $slides.children().each(function() {
      // If matches, set active class and remove from siblings
      if ($(this).is($link)) {
        disableSiblings($(this));
        $(this).addClass("active");
      }
    });
  });
});
