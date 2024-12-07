

document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.querySelector("form[action='/register']");
    if (registerForm) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent page reload
  
        const formData = new FormData(registerForm);
        const data = new URLSearchParams(formData);
  
        try {
          const response = await fetch("/register", {
            method: "POST",
            body: data,
          });
  
          if (response.ok) {

            window.location.href = "/login";
          } else {
            const error = await response.json();
            alert("Error: " + error.message);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        }
      });
    }
  

    const loginForm = document.querySelector("form[action='/login']");
    if (loginForm) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 
  
        const formData = new FormData(loginForm);
        const data = new URLSearchParams(formData);
  
        try {
          const response = await fetch("/login", {
            method: "POST",
            body: data,
          });
  
          if (response.ok) {
     
            window.location.href = "/blogs";
          } else {
            const error = await response.json();
            alert("Error: " + error.message);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        }
      });
    }
  

    const createBlogForm = document.querySelector("form[action='/blogs/create']");
    if (createBlogForm) {
      createBlogForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        const formData = new FormData(createBlogForm);
        const data = new URLSearchParams(formData);
  
        try {
          const response = await fetch("/blogs/create", {
            method: "POST",
            body: data,
          });
  
          if (response.ok) {

            const result = await response.json();
            window.location.href = `/blogs/${result._id}`;
          } else {
            const error = await response.json();
            alert("Error: " + error.message); 
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        }
      });
    }
  

    const commentForm = document.getElementById("comment-form");
    const commentInput = document.getElementById("comment-input");
    const commentsList = document.getElementById("comments-list");
  
    if (commentForm) {
      commentForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 
  
        const commentContent = commentInput.value.trim();
        const blogId = window.location.pathname.split("/")[2]; 
  
        if (commentContent) {
          try {
         
            const response = await fetch(`/blogs/comments/${blogId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: commentContent }),
            });
  
            if (response.ok) {
              const newComment = await response.json();
              const newCommentElement = document.createElement("li");
              newCommentElement.classList.add("bg-white", "p-4", "border", "border-gray-300", "rounded-lg", "shadow-sm");
              newCommentElement.innerHTML = `<p class="text-gray-700">${newComment.content}</p>`;
              commentsList.appendChild(newCommentElement);
  
        
              commentInput.value = "";
            } else {
              alert("Failed to post comment.");
            }
          } catch (error) {
            console.error("Error posting comment:", error);
          }
        }
      });
    }
  

    const searchForm = document.querySelector("form[action='/blogs/search']");
    if (searchForm) {
      searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        const searchQuery = new FormData(searchForm).get("query");
  
        try {
          const response = await fetch("/blogs/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: searchQuery }),
          });
  
          if (response.ok) {
            const results = await response.json();
            const blogList = document.querySelector(".blog-list");
            blogList.innerHTML = ""; 
  
            results.forEach((blog) => {
              const blogItem = document.createElement("div");
              blogItem.classList.add("blog-item");
              blogItem.innerHTML = `
                <h2>${blog.title}</h2>
                <p>${blog.content.substring(0, 100)}...</p>
                <a href="/blogs/${blog._id}">Read More</a>
              `;
              blogList.appendChild(blogItem);
            });
          } else {
            alert("Search failed. Please try again.");
          }
        } catch (error) {
          console.error("Error searching blogs:", error);
          alert("An error occurred while searching.");
        }
      });
    }
  });
  