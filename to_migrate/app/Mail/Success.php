<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class Success extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $tickets;
    public function __construct($name, $tickets)
    {
        $this->name = $name;
        $this->tickets = json_decode($tickets);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Você já está participando na Rifart!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.success',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
