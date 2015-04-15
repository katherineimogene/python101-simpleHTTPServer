window.onload = function(){
  var countData = "count_fp.json"
  var latestHitsData = "latest_hits.json"
  dataController = new DataController(countData, latestHitsData)
  drawer = new Drawer()
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
      formattedNumber = controller.formatNumber(data.result)
      controller.drawer.drawFingerprints(formattedNumber)
    })
  },

  handleLatestHits: function(){
    $.getJSON( this.latestHitsData, function( data ) {
      truncatedData = controller.truncateCwids(data.result)
      controller.drawer.drawLatestHits(truncatedData)
    })
  },

  formatNumber: function(number){
    return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
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
}

Drawer.prototype = {
  drawFingerprints: function(data) {
    $('#fingerprint_count').html(data)
  },

  drawLatestHits: function(data) {
    $.each(data, function(i, hit){
      if (i == 0) {
        var firstRow = $('.row')
        firstRow.find('.cwid').html(hit.cwid)
        firstRow.find('.fdomain').html(hit.fdomain)
      } else {;
        var row = $('.row')[0]
        var newRow = $(row).clone()
        newRow.find('.cwid').html(hit.cwid)
        newRow.find('.fdomain').html(hit.fdomain)
        $('.artifacts').append(newRow);
      }
    })
  }
}