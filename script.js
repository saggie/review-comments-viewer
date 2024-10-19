let page = 1;
const perPage = 100;

document.addEventListener('DOMContentLoaded', () => {
  const halfYearAgo = new Date();
  halfYearAgo.setMonth(halfYearAgo.getMonth() - 6);
  const since = halfYearAgo.toISOString().split('T')[0];
  document.getElementById('since').value = since;
});

document.getElementById('comment-form').addEventListener('submit', function(event) {
  event.preventDefault();
  clearComments();
  fetchComments();
});

document.getElementById('read-more').addEventListener('click', function() {
  page++;
  fetchComments();
});

function clearComments() {
  document.getElementById('comments-container').innerHTML = '';
}

async function fetchComments() {
  const owner = document.getElementById('owner').value;
  const repo = document.getElementById('repo').value;
  const since = document.getElementById('since').value;
  const user = document.getElementById('user').value;
  const token = document.getElementById('token').value;

  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/comments?since=${since}&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData.message} (${response.status})`);
    }

    const comments = await response.json();

    const userComments = comments.filter(comment => comment.user.login === user);

    renderComments(userComments);

    const readMoreButton = document.getElementById('read-more');
    if (comments.length === perPage) {
      readMoreButton.style.display = 'block';
    } else {
      readMoreButton.style.display = 'none';
    }

  } catch (error) {
    alert(`Failed to fetch comments: ${error.message}`);
  }
}

function renderComments(comments) {
  const commentsContainer = document.getElementById('comments-container');
  
  comments.forEach(comment => {
    const newCommentDiv = document.createElement('div');
    newCommentDiv.className = 'comment';

    newCommentDiv.innerHTML = `
      <hr>
      <p>
        @<b>${comment.user.login}</b>: ${comment.body}
        (<a href="${comment.html_url}" target="_blank">${new Date(comment.created_at).toLocaleString()}</a>)
      </p>
    `;

    commentsContainer.appendChild(newCommentDiv);
  });
}
