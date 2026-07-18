import styles from "./page.module.css";

export default function HomePage(): React.ReactElement {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <span className={styles.eyebrow}>Cognix</span>
        <h1 className={styles.title}>The AI Organization Operating System</h1>
        <p className={styles.subtitle}>
          Create, manage, and collaborate with autonomous AI teams through shared memory, workflows,
          projects, and intelligent agents.
        </p>
      </div>
    </main>
  );
}
