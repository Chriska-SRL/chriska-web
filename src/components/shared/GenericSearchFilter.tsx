'use client';

import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { VscDebugRestart } from 'react-icons/vsc';

type GenericSearchFilterProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const GenericSearchFilter = ({
  value,
  onChange,
  placeholder = 'Buscar...',
}: GenericSearchFilterProps) => {
  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

  return (
    <Flex gap="1rem" align="center" wrap="wrap" w="100%">
      <InputGroup w={{ base: '100%', md: '15rem' }}>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          bg={bgInput}
          borderColor={borderInput}
          _placeholder={{ color: textColor }}
          color={textColor}
        />
        <InputRightElement>
          <Icon boxSize="5" as={AiOutlineSearch} color={textColor} />
        </InputRightElement>
      </InputGroup>

      {value && (
        <IconButton
          aria-label="Reiniciar búsqueda"
          icon={<VscDebugRestart />}
          bg={bgInput}
          _hover={{ bg: hoverResetBg }}
          onClick={() => onChange('')}
        />
      )}
    </Flex>
  );
};

export function filterByFields<T>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    fields.some(field => {
      const value = item[field];
      return typeof value === 'string' && value.toLowerCase().includes(lowerQuery);
    })
  );
}
