import { Modal } from "antd";

const useConfirmAction = (action: () => void, title: string) => {
  const [modal, contextHolder] = Modal.useModal();

  const onClick = () => {
    modal.confirm({ title, centered: true }).then(
      () => {
        action();
      },
      () => undefined,
    );
  };

  return [contextHolder, onClick] as const;
};

export { useConfirmAction };
