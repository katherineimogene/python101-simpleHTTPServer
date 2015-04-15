window.onload = function(){
  var countData = "count_fp.json"
  var latestHitsData = "latest_hits.json"
  var domElements = { fingerprint: "#fingerprint_count",
                      table: "#artifacts",
                      row: ".row",
                      td_left: ".cwid",
                      td_right: ".fdomain" }
  dataController = new DataController(countData, latestHitsData)
  drawer = new Drawer(domElements)
  dataController.registerDrawer(drawer)
  dataController.handleFingerprints()
  dataController.handleLatestHits()
}

DataController = function(countData, latestHitsData){
  controller = this
  this.countData = countData
  this.latestHitsData = latestHitsData
}

DataController.prototype = {
  registerDrawer: function(drawer){
    this.drawer = drawer
  },

  handleFingerprints: function(){
    $.getJSON( this.countData, function( data ) {
      controller.drawer.drawFingerprints(data.result)
    })
  },

  handleLatestHits: function(){
    $.getJSON( this.latestHitsData, function( data ) {
      truncatedData = controller.truncateCwids(data.result)
      controller.drawer.drawLatestHits(truncatedData)
    })
  },

  truncateCwids: function(data){
    truncated = $.map(data, function(hit,i){
      hit.cwid = hit.cwid.substring(0,10)
      return hit
    })
    return truncated
  }
}

Drawer = function(domElements){
  this.domElements = domElements
}

Drawer.prototype = {
  drawFingerprints: function(data) {
    $(this.domElements.fingerprint).html(data)
  },

  drawLatestHits: function(data) {
    $.each(data, function(i, hit){
      if (i == 0) {
        var firstRow = $('#artifacts').find('.row')
        firstRow.find('.cwid').html(hit.cwid)
        firstRow.find('.fdomain').html(hit.fdomain)
      } else {;
        var row = $('.row')[0]
        var newRow = $(row).clone()
        newRow.find('.cwid').html(hit.cwid)
        newRow.find('.fdomain').html(hit.fdomain)
        $('#artifacts tr:last').after(newRow);
      }
    })
  }
}