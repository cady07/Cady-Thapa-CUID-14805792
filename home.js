document.addEventListener("DOMContentLoaded", () => {
    const postBtn = document.querySelector(".post-btn");
    const threadInput = document.querySelector(".start-thread input[type='text']");
    const imageUpload = document.querySelector(".start-thread input[type='file']");
    const addPostBtn = document.getElementById("addPostBtn");
    const preview = document.getElementById("preview");
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Trigger file upload when "Add Post" button is clicked
    addPostBtn.addEventListener("click", () => {
        imageUpload.click();
    });

    // Handle image preview
    imageUpload.addEventListener("change", handleImageUpload);
    postBtn.addEventListener("click", handlePost);
    document.addEventListener('click', handleActions);

    // Navigation click handling
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = link.getAttribute('data-section');
            switchSection(sectionId);
        });
    });

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                preview.innerHTML = ''; // Clear previous images
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }

    function handlePost() {
        const threadText = threadInput.value;
        const imgSrc = preview.querySelector('img')?.src;

        if (threadText.trim() !== "" || imgSrc) {
            createPost(threadText, imgSrc);
            threadInput.value = "";
            preview.innerHTML = ""; // Clear the image preview after posting
            imageUpload.value = ""; // Clear the file input after posting
        }
    }

    function handleActions(event) {
        if (event.target.classList.contains('like-btn')) {
            handleLike(event.target);
        } else if (event.target.classList.contains('comment-btn')) {
            handleComment(event.target);
        }
    }

    function createPost(text, imgSrc) {
        const feed = document.querySelector("#home .feed");
        const post = document.createElement("article");
        post.classList.add("post");

        const postHeader = `
            <div class="post-header">
                <div class="post-user">
                    <img src="user-placeholder.png" alt="User profile picture">
                    <span>you</span>
                </div>
                <span class="post-time">just now</span>
            </div>`;
        
        const postContent = `<p>${text}</p>`;
        const postImage = imgSrc ? `<img src="${imgSrc}" class="uploaded-image" alt="Uploaded image">` : '';
        const postActions = `
            <div class="post-actions">
                <span class="action like-btn">0 ❤️</span>
                <span class="action comment-btn">0 💬</span>
                <span class="action">0 🔁</span>
                <span class="action">🔗</span>
            </div>`;
        const commentSection = `
            <div class="comments-section">
                <input type="text" class="comment-input" placeholder="Add a comment..." aria-label="Add a comment">
            </div>`;
        
        post.innerHTML = postHeader + postContent + postImage + postActions + commentSection;
        feed.prepend(post);
    }

    function handleLike(likeBtn) {
        let likes = parseInt(likeBtn.textContent);
        likes++;
        likeBtn.textContent = `${likes} ❤️`;
    }

    function handleComment(commentBtn) {
        const post = commentBtn.closest('.post');
        const commentInput = post.querySelector('.comment-input');
        const commentText = commentInput.value.trim();

        if (commentText !== "") {
            const commentSection = post.querySelector('.comments-section');
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.textContent = `you: ${commentText}`;
            commentSection.appendChild(commentDiv);

            commentInput.value = "";  // Clear the comment input after posting

            // Update comment count
            let commentCount = parseInt(commentBtn.textContent);
            commentCount++;
            commentBtn.textContent = `${commentCount} 💬`;
        }
    }

    function switchSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active');
        }
    }
});
