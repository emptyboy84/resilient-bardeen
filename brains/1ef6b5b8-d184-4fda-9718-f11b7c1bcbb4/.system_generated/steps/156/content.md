Title: Live Content

Description: Fetched live

Source: http://www.meewoodesign.com

---

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta content="IE=edge" http-equiv="X-UA-Compatible">
  <meta content="width=device-width,initial-scale=1" name="viewport">
  <meta name="description" content="인테리어 디자인 전문업체, 업무, 교육, 상업 공간 인테리어 설계 및 시공">
  <meta name="naver-site-verification" content="d22dd46ec25006270a1f5eaeb1352e5d03fa71e9" />
  <meta property="og:title" content="미우디자인">
  <meta property="og:description" content="인테리어 디자인 전문업체, 업무, 교육, 상업 공간 인테리어 설계 및 시공">
  <meta name="google" content="notranslate" />
  <meta content="Mashup templates have been developped by Orson.io team" name="author">

  <!-- Disable tap highlight on IE -->
  <meta name="msapplication-tap-highlight" content="no">


  
  <link rel="apple-touch-icon" sizes="180x180" href="./assets/apple-icon-180x180.png">
  <link href="./assets/favicon.ico" rel="icon">
  <link rel="canonical" href="http://www.meewoodesign.com/">

  <title>미우디자인</title>  
  <style>
    #indexText{
      font-size: 2em; 
      background-color: rgb(255, 255, 255, 0.5);
      width: 300px;
    }

    .logoWrapper{
      width: 150px;
      height: 50px;
      margin: 0;
      position: absolute;
    }
    .logo{
      font-family: 'Roboto', sans-serif;
      font-size: 4em;
      color: black;
      float: left;
      list-style: none;
      margin-top: 0.7em;
      width: 100px;
      height: 60px;
      /* background-color: pink; */
    }
    #logoSquare{
      /* background-color: yellow; */
      width: 30px;
      height: 20px;
      margin-top: 5px;
      float: right;
      font-size: 25px;
      color: red;
      
    }
  </style>
<link href="./main.3f6952e4.css?after7" rel="stylesheet"></head>

<body class="minimal" oncontextmenu='return false' onselectstart='return false' ondragstart='return false'>
<div id="site-border-left"></div>
<div id="site-border-right"></div>
<div id="site-border-top"></div>
<div id="site-border-bottom" style="height: 3em;"></div>
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
        <div class="logoWrapper">
        <li class="logo">&nbsp;MWD</li><div id="logoSquare">■</div>
      </div>
      <div class="collapse navbar-collapse" id="navbar-collapse" >
        <ul class="nav navbar-nav " >
          <li><a href="./index.html" title="" style="color:  rgb(39, 39, 39);" >meewoodesign</a></li>
          <li><a href="./works.php?pageNum=0" title="" style="color:  rgb(39, 39, 39);" >projets</a></li>
          <li><a href="./about.html" title="" style="color: rgb(39, 39, 39);">à propos</a></li>
          <li><a href="./contact.html" title="" style="color: rgb(73, 73, 73);">contact</a></li>
        </ul>


      </div> 
    </div>
  </nav>
</header>
<!-- Add your site or app content here -->
  <div class="hero-full-container background-image-container white-text-container" id="indexSlide" style="background-image: url('images/춘천상상마당.jpg');">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="hero-full-wrapper">
            <div class="text-content" >
              <!-- <p id="indexText" >&nbsp;&nbsp;meewoodesign</p> -->
              <!-- <a class="sbnt" id="prev" style="float: left;" onclick="indexSlidePrev()">&#10094;</a>
              <a class="sbnt" id="blank" style="width: 80em;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
              <a class="sbnt" id="next" style="float: right;" onclick="indexSlideNext()">&#10095;</a> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


<script>
  window.onload = function () {
    let index = 1
    let imageArr = ["url('images/춘천상상마당.jpg')", "url('images/상상유니브아틀리에\ 부산1_.jpg')", "url('images/원주공장휴게홀3.jpg')"]
    let backImage = document.getElementById("indexSlide")

    setTimeout(
        function(){
        backImage.style.opacity = 0
        backImage.style.transition = "opacity 0.5s"
        
         }, 4500 )

    function indexSlide(){

      setTimeout(
        function(){
        backImage.style.backgroundImage = imageArr[index]
      }, 0000 )   

      setTimeout(
        function(){
        backImage.style.opacity = 1
        backImage.style.transition = "opacity 0.5s"
      }, 500 ) 

      setTimeout(
        function(){
        backImage.style.opacity = 0
        backImage.style.transition = "opacity 0.5s"
        index ++
         }, 4500 )

      

      if(index == 3){
        index = 0
      }

  }

    setInterval(indexSlide, 5000)
}


</script>


<script type="text/javascript" src="./main.70a66962.js"></script>
</body>

</html>

