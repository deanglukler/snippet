import { Button, Modal } from 'antd';
import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

const DeleteButton: React.FC<{ action: () => void }> = ({ action }) => {
  const [visible, setVisible] = useState(false);

  const handleOk = () => {
    action();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        icon={<DeleteOutlined />}
        type="text"
        size="small"
        onClick={() => setVisible(true)}
      >
        Delete
      </Button>
      <Modal
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        title="Are you sure?"
        footer={[
          <Button type="text" key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleOk}>
            Delete
          </Button>,
        ]}
      >
        <p>Do you want to delete this item?</p>
      </Modal>
    </>
  );
};

export default DeleteButton;
