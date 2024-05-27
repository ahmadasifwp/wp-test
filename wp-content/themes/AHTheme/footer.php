
<section class="footer_section">
  <div class="container">
    <p>
      <?php
      // Get custom footer text from theme customizer
      $custom_footer_text = get_theme_mod('custom_footer_text');
      if (!empty($custom_footer_text)) {
          echo esc_html($custom_footer_text);
      } else {
          // If custom footer text is empty, display default text
          echo '&copy; <span id="displayYear"></span> All Rights Reserved By <a href="https://html.design/">Free Html Templates</a>';
      }
      ?>
    </p>
  </div>
</section>
<!-- end footer section -->
  <!-- footer section -->
  <!-- jQery -->
  <script type="text/javascript" src="<?php echo get_template_directory_uri() ?>/js/jquery-3.4.1.min.js"></script>
  <!-- popper js -->
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous">
  </script>
  <!-- bootstrap js -->
  <script type="text/javascript" src="<?php echo get_template_directory_uri() ?>/js/bootstrap.js"></script>
  <!-- owl slider -->
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js">
  </script>
  <!-- custom js -->
  <script type="text/javascript" src="<?php echo get_template_directory_uri() ?>/js/custom.js"></script>
  <!-- Google Map -->
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCh39n5U-4IoWpsVGUHWdqB6puEkhRLdmI&callback=myMap">
  </script>
  <!-- End Google Map -->
</body>
</html>