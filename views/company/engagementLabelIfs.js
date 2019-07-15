// Possible Labels
// QUOTE INVITATION STAGE
  // Waiting // company has sent a quote invite (modal won't open)
  // Rejected / company or consultant has rejected the quote
  // NDA OCI Rejected /consultant rejected the NDA or OCI
  // Submitted / consultant has submitted a reply to the quote invitation (engagment has not been approved to start yet)

// ACTIVE ENGAGEMENT STAGE
  // Approved / company has approved the consultant to start work (milestones initially are not complete but during the process, at least one milestone needs to be approved)
  // Recurring / Unique for Recurring quotes
  // Accept & Pay / consultant has submitted/completed at least 1 milestone
  // Rate /Rating Needed  / company has approved all milestones but have  not rated the engagement yet
  // Completed / all milestones have been completed and engagement has been rated

//


angular.forEach(project.Engagements, function(engagement) {
  //NEW LABLES 1.24.19
  engagement.label = "";
  if(engagement.consultantSubmitted) {
    if(engagement.companyRejected) {
      // Company rejected the quote
      engagement.label = "Rejected";
      engagement.labelClass = "label-danger";
    }
    else if(engagement.companyApproved) {
      var notPaid = true;
      var notRate = true;
      var notCompleted = true;
      if(engagement.quoteInvitationInfo.quoteType === 1) {
        //fixed
        angular.forEach(engagement.quoteInvitationInfo.qFix, function(fixed) {
          if(notPaid) {
            if(fixed.completed) {
              if(fixed.approved) {
                if(fixed.rated) {
                  engagement.label = "Completed";
                  engagement.labelClass = "label-default";
                }
                else {
                  notRate = false;
                  var ratingNeeded = true;
                  engagement.label = "Rate";
                  engagement.labelClass = "label-primary";
                }
              }
              else {
                notPaid = false;
                engagement.label = "Accept & Pay";
                engagement.labelClass = "label-warning";
              }
            }
            else {
              if(notPaid && notRate) {
                engagement.label = "Approved";
                engagement.labelClass = "label-success";
              }

            }
          }
        })
      }
      else if(engagement.quoteInvitationInfo.quoteType === 2) {
        //hourly
        angular.forEach(engagement.quoteInvitationInfo.qHours, function(hourly) {
          if(notPaid) {
            if(hourly.completed) {
              if(hourly.approved) {
                if(hourly.rated) {
                  engagement.label = "Completed";
                  engagement.labelClass = "label-default";
                }
                else {
                  notRate = false;
                  var ratingNeeded = true;
                  engagement.label = "Rate";
                  engagement.labelClass = "label-primary";
                }
              }
              else {
                notPaid = false;
                engagement.label = "Accept & Pay";
                engagement.labelClass = "label-warning";
              }
            }
            else {
              if(notPaid && notRate) {
                engagement.label = "Approved";
                engagement.labelClass = "label-success";
              }
            }
          }
        })

      }
        else if(engagement.quoteInvitationInfo.quoteType === 3) {
          engagement.label = "Recurring";
          engagement.labelClass = "label-success";
        }
    }
    else {
        // Consultant has submitted a quote
        engagement.label = "Submitted";
        engagement.labelClass = "label-primary";
    }
  }
  else if(engagement.consultantRejected) {
    // Consultant has rejected a quote
    engagement.label = "Rejected";
    engagement.labelClass = "label-danger";
  }
  else if(engagement.consultantOCINDARejected) {
    // Consultant did not accept the NCA or OCI
      engagement.labelClass = "label-danger";
      if(engagement.oci && !engagement.nda) {
        engagement.label = "OCI Rejected";
      }
      else if(!engagement.oci && engagement.nda) {
        engagement.label = "NDA Rejected";
      }
      else {
        engagement.label = "NDA & OCI Rejected";
      }

  }
  else {
    // Company has submitted a quote but the Consultant has not responded
    engagement.label = "Waiting";
    engagement.labelClass = "label-default";
  }

})
