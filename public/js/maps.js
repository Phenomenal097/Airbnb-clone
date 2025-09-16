       Radar.initialize(mapToken);
        const map = Radar.ui.map({
          container: 'map', // OR document.getElementById('map')
          style: 'radar-default-v1',
          center: [-73.9911, 40.7342], 
          zoom: 14,
        });