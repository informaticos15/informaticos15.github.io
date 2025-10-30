const boddy = document.getElementById('body');

boddy.innerHTML +=`
<div class="toptwo"> toptwo     
    </div>

    <div class="container">
     
      <div class="item head">

        <div class="back"> INFORMATICOS 15</div>
        <div id="a" class="lamina"></div>
        <div id="b" class="lamina"></div>
        <div id="c" class="lamina"></div>
        <div id="d" class="lamina"></div>
        <marquee id="marq">
  	       	<b>
  	          Bienvenido al Blog de la Cohorte 2015 de Informática de la UPEL-IMPM Yaracuy. Aquí encontrarás: Toda la 
  	            <a href="pensum.html">INFORMACIÓN</a> de las materias de la especialidad informática
  	          + <a href="pensum.html">CONTENIDOS</a> de otras materias generales
  	          + <a href="reglamentos.html"> NORMATIVAS</a> de la UPEL 
  	          + <a href='posts.html'> TIPS</a> de estudio 
  	          + <a href='recursos.html'> RECURSOS</a> de estudio 
  	          + <a href="libros-de-texto.html">LIBROS</a> de texto
  	        </b>
        </marquee>	      
      </div>    
    
      <div class="nav navbar15 flex-centrado" id='navbar15'>
        <ul class="nav45">       
          

          <li id='nav_home' class="flex-centrado">
            <a id='sider' class='flex-centrado'>
              <img alt="informaticos 15" src="img/i15_mini.png">
            </a>
            <kbd style="letter-spacing: 3px">/home</kbd>
          </li>

           <li id='nav_heuristica' class='li45'><i class="fa fa-search"></i> Heurística
            <ul>
              <li class='primera'><a href='investigacion/intro-investigacion.html'>Intro Investigación</a></li>
              <li><a href='investigacion/investigacion-educativa.html'>Invest. Educativa</a></li>
            </ul>
          </li>

          <li class='li45' id='nav_programacion'> { } Programación 
            <ul>
              <div id='programacion_div'>
                <div>              
                      <li><a href="programacion/estructura-de-datos-y-programacion-i.html"> Estruct de Datos I</a></li>
                    <li><a href="programacion/estructura-de-datos-y-programacion-ii.html"> Estruct de Datos II</a></li>
                    <li><a href="programacion/estructura-de-datos-y-programacion-iii.html"> Estruct de Datos III</a></li>
                </div>
                <div>
                    <li><a href="programacion/bases-de-datos.html"> Bases de Datos</a></li>
                    <li><a href="programacion/lenguajes-de-programacion-web.html"> Leng. de Program WEB</a></li>
                    <li><a href="programacion/internet-y-html.html"> Internet y HTML</a></li>            
                </div>
              </div>
            </ul>
          </li>	   
         	
  		    <li class='li45' id='nav_mat'>∑ Matemática
            <ul>
              <div id='matematica_div'>
                <div>              
                    <li><a href='matematica/intro-calculo.html'>Intro al Cálculo</a></li>
                    <li><a href='matematica/intro-algebra.html'>Intro al Álgebra</a></li>
                    <li><a href='matematica/intro-algebra-lineal.html'>Álgebra Lineal</a></li>
                </div>
                <div>
                    <li><a href='matematica/calculo-integral-y-diferencial.html'>Cálculo Integral</a></li>
                    <li><a href='matematica/matematica-discreta.html'>Matemática Discreta</a></li>
                    <li><a href='matematica/eae.html'>Estadísticas</a></li>        
                </div>
              </div>              
            </ul>
          </li>
        
          <li class='li45' id='nav_sis'>ㅱ Sistemas        	
          	<ul >
          		<div id='sis_div'>
          			<div id='sis_div2'>       
                </div>

          			<div id=''> 
  	        			  <li id='nav_iinf' class='img_sist_nav' data-img='0'><a href="http://informaticos15.blogspot.com/p/intro-informatica.html">Intro Informática</a></li>
  	             		<li id='nav_edig' class='img_sist_nav' data-img='1'><a href='sistemas/electronica-digital.html'>Electrónica Digital</a></li>
  	             		<li id='nav_sinf' class='img_sist_nav' data-img='2'><a href='sistemas/sistemas-de-info.html'>Sistemas de <br/>Información</a></li>
  	             		<li id='nav_scom' class='img_sist_nav' data-img='3'><a href='sistemas/redes-de-compu.html'>Sistemas de Computación</a></li>
  	             		<li id='nav_rinf' class='img_sist_nav' data-img='4'><a href='sistemas/redes-de-compu.html'>Redes Informáticas</a></li>
               		</div>
        			</div>
        		</ul>
          </li>

          <li class='li45' id='nav_bib'><i class="fa fa-book"></i> Biblioteca
          	<div class='punta'>🔺</div>
             	<ul id='bib_div'>  
          			<li class='primera'><a href='/pensum-de-informatica-upel.html'>Pensum</a></li>
          		  <li><a href='/recursos.html'>Recursos</a></li>
          		  <li><a href='/libros-de-texto.html'>Libros de Texto</a></li>
          		  <li><a href='/planes-de-curso.html'>Planes de Curso</a></li>
          		  <li><a href='/reglamentos.html'>Reglamentos</a></li> 
             </ul>
          </li>



          <li class='li45'><i class="fa fa-connectdevelop"></i> Workshops
            <ul>
              <div class='workshops_menu' >
                <div class='primera'>
                  <a>Rey de Redes</a>
                  <img src="img/taller_redes.png" alt="taller-redes"/>
                </div>
                <div>
                  <a>Web Developer</a>
                  <img src="img/web_dev.png" alt="taller-web-developer"/>
                </div>
                <div>
                  <a>LAGIGF</a>
                  <img src="img/google_sheets.png" alt="curso-sheets"/>
                </div>
                <div>
                  <a>Automatizacion</a>
                  <img src="img/automatizacion.png" alt="taller-automatizacion"/>         
                </div>
              </div>
            </ul>
          </li>

          <li class='li45' id='nav_contacto'><a href='contacto.html'><i class="fa fa-phone-square"></i> Contacto</a></li>
        </ul>       
      </div>
     
      <div class="item side" id='side'>
        	<div class="item logos">
        		<div class="logo i15">
        			<p>Informaticos15</p>
        			<img alt="informaticos15" src="img/i15.png"><!---->
    	      </div>
    	      <div class="logo upel"><!--UPEL--><img alt="UPEL" src="img/upel.jpg"><div><p>Universidad<p>Pedagogica<p>Experimental<p>Libertador</div>
    	      </div>
    	      <div class="logo impm"><!--IMPM--><img alt="IMPM" src="img/impm.png"><div><p>Instituto<p>Mejoramiento<p>Profesional<p>Magisterio</div>
    	      </div>
          </div>

    	    <div class="item buscar flex-centrado">
            <input>
            <button><i class="fa fa-search"></i>Buscar</button>
          </div>

          <div class="item menuv flex-centrado">
              <ul class='flex-centrado'>
                <li class='nivel1'><a href='matematica.html' class='nivel1'>MATEMÁTICA</a>
                  <ul>
                    <li class='primera'><a href='matematica/intro-calculo.html'><i class="fa fa-caret-right"></i> Intro al Cálculo</a></li>
                    <li><a href='matematica/intro-algebra.html'><i class="fa fa-caret-right"></i> Intro al Álgebra</a></li>
                    <li><a href='matematica/intro-algebra-lineal.html'><i class="fa fa-caret-right"></i> Álgebra Lineal</a></li>
                    <li><a href='matematica/calculo-integral-y-diferencial.html'><i class="fa fa-caret-right"></i> Cálculo Integral</a></li>
                    <li><a href='matematica/matematica-discreta.html'><i class="fa fa-caret-right"></i> Matemática Discreta</a></li>
                    <li><a href='matematica/eae.html'><i class="fa fa-caret-right"></i> Estadísticas</a></li>
                  </ul>
                </li>

                <li class='nivel1'><a href='sistemas.html' class='nivel1'>SISTEMAS</a>
                  <ul>
                    <li class='primera'><a href='programacion/intro_informatica.html'><i class="fa fa-caret-right"></i> Intro Informática</a></li>
                    <li ><a href='sistemas/electronica-digital.html'><i class="fa fa-caret-right"></i> Electrónica Digital</a></li>
                    <li><a href='sistemas/sistemas-de-info.html'><i class="fa fa-caret-right"></i> Sist de Información</a></li>
                    <li><a href='sistemas/redes-de-compu.html'><i class="fa fa-caret-right"></i> Sist de Computación</a></li>
                    <li><a href='sistemas/redes-de-compu.html'><i class="fa fa-caret-right"></i> Redes Informáticas</a></li>
                  </ul>
                </li>

                <li class='nivel1'><a href='/programacion.html' class='nivel1'>PROGRAMACIÓN</a>
                  <ul>                  
                    <li class='primera'><a href='programacion/estructura-de-datos-y-programacion-i.html'><i class="fa fa-caret-right"></i> Estruc Datos Progr I</a></li>
                    <li><a href='programacion/estructura-de-datos-y-programacion-ii.html'><i class="fa fa-caret-right"></i> Estruct Datos Progr II</a></li>
                    <li><a href='programacion/bases-de-datos.html'><i class="fa fa-caret-right"></i> Bases de Datos</a></li>
                    <li><a href='programacion/estructura-de-datos-y-programacion-iii.html'><i class="fa fa-caret-right"></i> Estruc Datos Progr III</a></li>
                    <li><a href='programacion/internet-y-html.html'><i class="fa fa-caret-right"></i> Internet y HTML</a></li>
                    <li><a href='programacion/lenguajes-de-programacion-web.html'><i class="fa fa-caret-right"></i> Lenguajes Progr Web</a></li>
                  </ul>
                </li>

                <li class='nivel1'><a href='' class='nivel1'>HEURÍSTICA</a>
                  <ul>
                    <li class='primera'><a href='investigacion/intro-investigacion.html'><i class="fa fa-caret-right"></i> Intro Investigación</a></li>
                    <li><a href='investigacion/investigacion-educativa.html'><i class="fa fa-caret-right"></i> Investig Educativa</a></li>
                  </ul>
                </li>
                
                <li class='nivel1'><a href='/biblioteca' class='nivel1'>BIBLIOTECA</a>
                  <ul>
                    <li class='primera'><a href='/pensum-de-informatica-upel.html'><i class="fa fa-caret-right"></i> Pensum</a></li>
                    <li><a href='/recursos.html'><i class="fa fa-caret-right"></i> Recursos</a></li>
                    <li><a href='/libros-de-texto.html'><i class="fa fa-caret-right"></i> Libros de Texto</a></li>
                    <li><a href='/planes-de-curso.html'><i class="fa fa-caret-right"></i> Planes de Curso</a></li>
                    <li><a href='/reglamentos.html'><i class="fa fa-caret-right"></i> Reglamentos</a></li>
                  </ul>
                </li>
                <li class='nivel1'><a href='/workshops' class='nivel1'>WORKSHOPS</a>
                  <ul>
                    <li class='primera'><a href=''><i class="fa fa-caret-right"></i> Rey de Redes</a></li>
                    <li><a href='/'><i class="fa fa-caret-right"></i> Web Developer</a></li>
                    <li><a href='/'><i class="fa fa-caret-right"></i> Sheets</a></li>
                    <li><a href='/'><i class="fa fa-caret-right"></i> Automatizacion</a></li>                  
                  </ul>
                </li>
                 <li class='nivel1'><a href='/snippets' class='nivel1'>SNIPPETS</a>
                  <ul>
                    <li class='primera'><a href=''><i class="fa fa-caret-right"></i> Pensum</a></li>
                    <li><a href='/'><i class="fa fa-caret-right"></i> Recursos</a></li>
                    <li><a href='/'><i class="fa fa-caret-right"></i> Libros de Texto</a></li>
                    <li><a href='/'><i class="fa fa-caret-right"></i> Planes de Curso</a></li>
                    <li><a href='/'><i class="fa fa-caret-right"></i> Reglamentos</a></li>
                  </ul>
                </li>
              </ul>
          </div>

          <div class="item twitter"   async='async'>
          <a class="twitter-timeline" data-lang="es" data-width="150%" data-height="100%" data-dnt="true" data-link-color="#3499fe" href="https://twitter.com/gatuso413?ref_src=twsrc%5Etfw"></a> 
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
          </div>
      </div>
      
      <div class="item main">      	       
  	  </div>
     
  	  <div class="item foot flex-centrado">
       <div>  
  	   <center class="rrss">
          <a href="https://www.facebook.com/" rel="noopener"><div class='flex-centrado'><i class="fa fa-facebook-official"></i></div></a>
          <a href="https://www.instagram.com/informaticos15" target="_blank" rel="noopener"><div class='flex-centrado'><i class="fa fa-instagram"></i></div></a>
          <a href="https://twitter.com/ivanguillermolp" target="_blank" rel="noopener"><div class='flex-centrado'><i class="fa fa-twitter"></i></div></a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener"><div class='flex-centrado'><i class="fa fa-youtube"></i></div></a>
       </center> 
       <br/>  
       </div>   
  	   <p>por <a href="ivanlopezpedreanez.net.ve">Ivan Guillermo Lopez Pedreañez</a></p>     
       </div>
      </div>
    </div>
  </body>`
    
    
        const img_sist=[
          'intro_informatica', 'electronica_digital', 'sistemas_informacion', 'sistemas_computacion',  'redes_informaticas'  
        ]
        const imgsistnav = Array.from(document.querySelectorAll('.img_sist_nav'));
        var z = document.querySelector('#sis_div2');

        imgsistnav.forEach( isn => isn.addEventListener('mouseover', imgsistnavchange))
        imgsistnav.forEach( isn => isn.addEventListener('mouseout', imgsistnavchangeback))

        function imgsistnavchange(){
          var i = this.dataset.img ;
         

          z.style.background=`url('img/pptx/` + img_sist[i] + `.png')`;
          z.style.backgroundSize=`900px 330px`;   
        }
        function imgsistnavchangeback(){
          z.style.background=`url('sistemas.png')`;
          z.style.backgroundSize=`900px 330px`; 
        }
    
      var home = document.getElementById('sider');
      home.addEventListener('click', side);

      var sideb=document.getElementById('side');

      var x = 0;
    	function side(){
        x++;
        if(x%2 > 0){
    		sideb.style.left='-220px';
        sideb.style.width='0px';
        prevvbut.style.left='0vw';
        nexttbut.style.left='61vw';    
        }
        else
        {
        sideb.style.left='0px';
        sideb.style.width='200px';
        prevvbut.style.left='15vw';
        nexttbut.style.left='66vw';
        }
        
    	}    
   
    	const navs = document.querySelector('#navbar15');  
      const topOfNav = navs.offsetTop;  
      
      function fixNav(){
      if(window.scrollY >= topOfNav)
        {
        document.body.style.paddingTop = document.querySelector('#navbar15').offsetHeight + 'px';
        document.body.classList.add('fixed-nav');
        }
      else 
        {
        document.body.classList.remove('fixed-nav')
        document.body.style.paddingTop = 0
        }
      }
      window.addEventListener('scroll', fixNav);
    