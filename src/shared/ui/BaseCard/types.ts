export interface Props {
  title?: string;
  number?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  showOpenButton?: boolean;
  onOpen?: () => void;
}
