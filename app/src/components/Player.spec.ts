import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/dom';
import { describe, test, expect } from 'vitest';


import Player from './Player';

describe('Player (Fase 0)', () => {
  test('inicia ao clicar em Play e para no Stop', async () => {
    render(<Player />);

    const playBtn = await screen.findByRole('button', { name: /play/i });
    // Sem clique: contexto deve estar suspenso
    expect(window.__mixer?.state).toBe('suspended');

    await userEvent.click(playBtn); // interação de usuário recomendada
    expect(window.__mixer?.state).toBe('running');
    expect((window.__mixer?.sourceCount ?? 0)).toBeGreaterThan(0);

    const stopBtn = await screen.findByRole('button', { name: /stop/i });
    await userEvent.click(stopBtn);
    expect(window.__mixer?.sourceCount).toBe(0);
  });

  test('sliders alteram ganho das camadas', async () => {
    render(<Player />);
    await userEvent.click(await screen.findByRole('button', { name: /play/i }));

    const sliders = screen.getAllByRole('slider');
    const lofiSlider = sliders[0];
    const rainSlider = sliders[1];

    // Para <input type="range">, dispare um input/change explícito
    fireEvent.input(lofiSlider, { target: { value: '0.33' } });
    fireEvent.input(rainSlider, { target: { value: '0.66' } });

    expect(window.__mixer?.gainsValues).toEqual({ lofi: 0.33, rain: 0.66 });
  });
});
