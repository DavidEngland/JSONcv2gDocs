function cv() {
  var aURL = "https://registry.jsonresume.org/davidengland.json";
  var response = UrlFetchApp.fetch(aURL); // get feed

  var r = JSON.parse(response.getContentText());

  var normal = {};
  normal[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
  normal[DocumentApp.Attribute.LINE_SPACING] = 1;
  normal[DocumentApp.Attribute.BOLD] = false;

  var cellStyle = {};
  cellStyle[DocumentApp.Attribute.BORDER_WIDTH] = 0;
  cellStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;

  var cLeft = {};
  cLeft[DocumentApp.Attribute.BOLD] = true;

  var cCenter = {};
  cCenter[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;

  var cRight = {};
  cRight[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.RIGHT;

  var small = {}
  small[DocumentApp.Attribute.FONT_SIZE] = 8;

  /*
  var hdr = DocumentApp.getActiveDocument().getHeader();
  if (hdr) {
    hdr.clear();
  }
*/

  var body = DocumentApp.getActiveDocument().getBody();
  /*
  var atts = body.getAttributes();
  Logger.log(atts);
  */
  body.clear();
  body.setAttributes(normal);

  // Append a document header paragraph.
  var header = body.insertParagraph(0, r.basics.name);
  header.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  //  body.appendParagraph('');


  if (r.basics.picture) {
    //   var img = DriveApp.getFileById('0B0f2l6dqKJJYbFdiNUVpNldfNzQ').getBlob();
    var img = UrlFetchApp.fetch(r.basics.picture);
    //        Logger.log(img);
    var img_blob = img.getBlob();
    //    Logger.log(img_blob);
    var pImage = body.appendParagraph('').addPositionedImage(img_blob).setLeftOffset(350).setWidth(128).setHeight(128);
    pImage.setLayout(DocumentApp.PositionedLayout.BREAK_LEFT);

  }


  body.appendParagraph(r.basics.location.address);
  body.appendParagraph(r.basics.location.city + ', ' + r.basics.location.region + '  ' + r.basics.location.postalCode);
  body.appendParagraph('');

  body.appendParagraph(r.basics.phone);
  body.appendParagraph(r.basics.email);
  body.appendParagraph(r.basics.website);

  body.appendHorizontalRule();

  body.appendParagraph(r.basics.summary);

  var section = body.appendParagraph("Social Profiles");
  section.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  var socials = body.appendTable();
  socials.setAttributes(cellStyle);
  var tr = socials.appendTableRow();
  //  tr.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  for (var i = 0; i < r.basics.profiles.length; i++) {
    var s = tr.appendTableCell(r.basics.profiles[i].network);
    s.setLinkUrl(r.basics.profiles[i].url);
    s.getChild(0).asParagraph().setAttributes(cCenter);
    //    s.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    /*
        var social = body.appendListItem(r.basics.profiles[i].network);
        social.setLinkUrl(r.basics.profiles[i].url);
        social.setGlyphType(DocumentApp.GlyphType.BULLET)
    */
  }

  // Append a section header paragraph.
  var section = body.appendParagraph("Skills");
  section.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  var sTbl = body.appendTable();
  sTbl.setBorderWidth(0);


  for (var i = 0; i < r.skills.length; i++) {
    var skills = sTbl.appendTableRow();
    skills.appendTableCell(r.skills[i].name + ':  ');
    sTbl.getRow(i).getCell(0).getChild(0).asParagraph().setAttributes(cLeft);
    sTbl.getRow(i).getCell(0).setWidth(100);
    var sklls = '';
    for (var j = 0; j < r.skills[i].keywords.length - 1; j++) {
      sklls += r.skills[i].keywords[j] + ', ';
    }

    sklls += r.skills[i].keywords[r.skills[i].keywords.length - 1] + '.';
    skills.appendTableCell(sklls);
    sTbl.getRow(i).getCell(1).getChild(0).asParagraph().setAttributes(normal);

  }

  var section = body.appendParagraph("Experience");
  section.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  for (var i = 0; i < r.work.length; i++) {
    var cell = [
      [r.work[i].position, r.work[i].company, parseDate(r.work[i].startDate) + ' to ' + parseDate(r.work[i].endDate)]
    ];
    var job = body.appendTable(cell);
    job.setBorderWidth(0);
    job.getRow(0).getCell(0).setAttributes(cLeft);
    job.getRow(0).getCell(1).getChild(0).asParagraph().setAttributes(cCenter);
    if (r.work[i].website) {
      job.getRow(0).getCell(1).setLinkUrl(r.work[i].website);
    }
    job.getRow(0).getCell(2).getChild(0).asParagraph().setAttributes(cRight);
    if (r.work[i].summary) {
      body.appendParagraph(r.work[i].summary);
    }
    if (definedAndNotEmpty(r.work[i].highlights)) {
      for (var j = 0; j < r.work[i].highlights.length; j++) {

        var hl = body.appendListItem(r.work[i].highlights[j]);
        hl.setGlyphType(DocumentApp.GlyphType.BULLET)
      }
    }
  }

  var section = body.appendParagraph("Education");
  section.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  for (var i = 0; i < r.education.length; i++) {
    if (r.education[i].studyType) {
      var cell = [
        [r.education[i].studyType, r.education[i].institution, parseDate(r.education[i].startDate) + ' to ' + parseDate(r.education[i].endDate)]
      ];
    } else {
      var cell = [
        ['', r.education[i].institution, parseDate(r.education[i].startDate) + ' to ' + parseDate(r.education[i].endDate)]
      ];
    }
    var degree = body.appendTable(cell);

    degree.setBorderWidth(0);
    degree.getRow(0).getCell(0).setAttributes(cLeft);
    degree.getRow(0).getCell(0).setWidth(40);
    degree.getRow(0).getCell(1).getChild(0).asParagraph().setAttributes(cCenter);

    degree.getRow(0).getCell(2).getChild(0).asParagraph().setAttributes(cRight);
    if (definedAndNotEmpty(r.education[i].area)) {
      degree.getRow(0).getCell(1).appendParagraph(r.education[i].area);
      degree.getRow(0).getCell(1).getChild(1).asParagraph().setAttributes(cCenter);
    }
    if (definedAndNotEmpty(r.education[i].gpa)) {
      degree.getRow(0).getCell(2).appendParagraph('GPA:  ' + r.education[i].gpa);
      degree.getRow(0).getCell(2).getChild(1).asParagraph().setAttributes(cRight);
    }
    if (definedAndNotEmpty(r.education[i].summary)) {
      body.appendParagraph(r.education[i].summary);
    }
    if (definedAndNotEmpty(r.education[i].courses)) {
      body.appendParagraph("Courses:").setBold(true);
      for (var j = 0; j < r.education[i].courses.length; j++) {
        body.appendListItem(r.education[i].courses[j]).setGlyphType(DocumentApp.GlyphType.BULLET);
      }
    }
  }
  var foot = DocumentApp.getActiveDocument().getFooter();
  if (foot) {
    foot.clear();

  } else {
    var foot = DocumentApp.getActiveDocument().addFooter()
  }
  foot.setAttributes(small);
  foot.appendHorizontalRule();
  var tfoot = foot.appendTable();
  tfoot.setBorderWidth(0);
  var rfoot = tfoot.appendTableRow();
  var clfoot = rfoot.appendTableCell(r.basics.phone);
  clfoot.setAttributes(cLeft)
  clfoot.setWidth(150);

  var mfoot = rfoot.appendTableCell(r.basics.location.address);
  tfoot.getRow(0).getCell(1).appendParagraph(r.basics.location.city + ', ' + r.basics.location.region + '  ' + r.basics.location.postalCode);
  mfoot.setAttributes(normal);
  mfoot.setAttributes(cCenter);

  var crfoot = rfoot.appendTableCell(r.basics.email);
  crfoot.setAttributes(normal);
  crfoot.setAttributes(cRight);
}
// parse a date in yyyy-mm-dd format
function parseDate(input) {
  if (input) {
    var parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    //return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
    if (parts[2]) return parts[1] + '/' + parts[2] + '/' + parts[0]
    else if (parts[1]) return parts[1] + '/' + parts[0]
    else return parts[0];
  } else {
    return "Present";
  }
}

function definedAndNotEmpty(value) {
  return (typeof value != 'undefined' && value.length > 0);
}
