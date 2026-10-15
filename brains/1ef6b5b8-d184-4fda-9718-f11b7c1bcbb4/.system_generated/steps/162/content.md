Title: Live Content

Description: Fetched live

Source: http://www.meewoodesign.com/contact.html

---

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta content="IE=edge" http-equiv="X-UA-Compatible">
  <meta content="width=device-width,initial-scale=1" name="viewport">
  <meta content="description" name="description">
  <meta name="google" content="notranslate" />
  <meta content="Mashup templates have been developped by Orson.io team" name="author">

  <!-- Disable tap highlight on IE -->
  <meta name="msapplication-tap-highlight" content="no">
  
  <link rel="apple-touch-icon" sizes="180x180" href="./assets/apple-icon-180x180.png">
  <link href="./assets/favicon.ico" rel="icon">
  <title>미우디자인</title>  

<link href="./main.3f6952e4.css" rel="stylesheet"></head>

<body class="">
 <!-- Add your content of header -->
<header>
  <nav class="navbar  navbar-fixed-top navbar-default" style="background-color: none;">
    <div class="container" >
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false" >
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar" ></span>
          <span class="icon-bar" ></span>
          <span class="icon-bar" ></span>
        </button> 
      <div class="collapse navbar-collapse" id="navbar-collapse" >
        <ul class="nav navbar-nav ">
          <li><a href="./index.html" title="" style="color: rgb(45, 45, 45);" >meewoodesign</a></li>
          <li><a href="./works.php?pageNum=0" title="" style="color: rgb(45, 45, 45);" >projets</a></li>
          <li><a href="./about.html" title="" style="color:rgb(45, 45, 45);">à propos</a></li>
          <li><a href="./contact.html" title="" style="color:rgb(45, 45, 45);">contact</a></li>
        </ul>


      </div> 
    </div>
  </nav>
</header>

<div class="section-container">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="section-container-spacer text-center">
            <h1 class="h2">contact</h1>
          </div>
          
          <div class="row">
            <div class="col-md-10 col-md-offset-1">
               <form action="" class="reveal-content">
                  <div class="row">
                    <div class="col-md-7" >
                    <!--KAKAO MAP-->
                    <div id="map" style="width: 100%; height: 500px;" ></div>
                    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=5bcab625bfb52756041cba82638f968a"></script>
                    <script>
                      var container = document.getElementById('map');
                      var options = {
                        center: new kakao.maps.LatLng(37.506641904323736, 127.06530537119627),
                        level: 3
                      };

                      var map = new kakao.maps.Map(container, options);

                      var markerPosition  = new kakao.maps.LatLng(37.506641904323736, 127.06530537119627);

                      var marker = new kakao.maps.Marker({
                        position: markerPosition
                      });

                      marker.setMap(map);
                    </script>
                    <!--KAKAO MAP-->
                    </div>
                    <div class="col-md-5 address-container" style="padding: 0 10% 0 10%;">
                      <h3>meewoodesign</h3>
                      <ul class="list-unstyled">
                        <li>
                          <span class="fa-icon">
                            <i class="fa fa-phone" aria-hidden="true"></i>
                          </span>
                          + 02 3484 7788
                        </li>
                        <li>
                          <span class="fa-icon">
                            <i class="fa fa-at" aria-hidden="true"></i>
                          </span>
                          meewoodesign@mw.com
                        </li>
                        <li>
                          <span class="fa-icon">
                            <i class="fa fa fa-map-marker" aria-hidden="true"></i>
                          </span>
                          강남구 영동대로 416 케이티앤지 타워
                        </li>
                      </ul>
                    </div>
                  </div>
                </form>
            </div>

          </div>
         
       </div>
      </div>
    </div>
  </div>


<!-- <footer class="footer-container text-center">
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <p>© UNTITLED | Website created with <a href="http://www.mashup-template.com/" title="Create website with free html template">Mashup Template</a>/<a href="https://www.unsplash.com/" title="Beautiful Free Images">Unsplash</a></p>
      </div>
    </div>
  </div>
</footer> -->




 <script type="text/javascript" src="./main.70a66962.js"></script></body>

</html>

