/************* event listeners  **************/

// the following two lines just listen for the button to be clicked on the 
//main comment form, and run the leaveComment function when it is

var el = document.getElementById("1");

el.addEventListener('click', leaveComment);



/*********pages functions*************/

	function leaveComment(){

            console.log('leaveComment triggered');

			if(document.forms["leave_comment"]["comment"].value != ''){

			var comment = document.forms["leave_comment"]["comment"].value;

			
			
			//we emit back to to main.js the comment
			
			self.port.emit("comment", comment);
		    

		    }// end if
	 
		}// end leaveComment
