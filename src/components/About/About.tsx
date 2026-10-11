import { useEffect, useState } from "react";
import "./About.css";
import { Modal } from "../Modal/Modal";
import { useSettingStore } from "../../store/SettingStore";

type Comment = {
  id: string;
  author: string;
  content: string;
  createdTime: string | null;
};
type Thread = Comment & { replies: Comment[] };

type AboutProps = { photoId: string };

const formatDate = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(iso))
    : "";

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <>
      <div className="about-comment__meta">
        <span className="about-comment__author">{comment.author}</span>
        <span className="about-comment__date">
          {formatDate(comment.createdTime)}
        </span>
      </div>
      <p className="about-comment__content">{comment.content}</p>
    </>
  );
}

/** Shows the Google Drive comments left on the photo currently on screen. */
export const About = ({ photoId }: AboutProps) => {
  const { closeAbout } = useSettingStore();
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments?id=${encodeURIComponent(photoId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { comments: Thread[] }) => {
        if (!cancelled) setThreads(data.comments);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [photoId]);

  let body;
  if (failed) {
    body = <p className="about-body">Couldn't load comments.</p>;
  } else if (threads === null) {
    body = <p className="about-body">Loading comments…</p>;
  } else if (threads.length === 0) {
    body = <p className="about-body">No comments on this photo yet.</p>;
  } else {
    body = (
      <ul className="about-comments">
        {threads.map((thread) => (
          <li key={thread.id} className="about-comment">
            <CommentItem comment={thread} />
            {thread.replies.length > 0 && (
              <ul className="about-replies">
                {thread.replies.map((reply) => (
                  <li key={reply.id} className="about-reply">
                    <CommentItem comment={reply} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Modal title="About this image" onClose={closeAbout}>
      {body}
    </Modal>
  );
};
